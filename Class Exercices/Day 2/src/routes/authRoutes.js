import express from "express";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import crypto from "node:crypto";
import {config} from "../config.js";
import { db } from "../db.js";
import { toProfileDto } from "../mappers.js";
import { toUserDto } from "../mappers.js";
import {requireAdmin} from "../middleware/requireAdmin.js";
import {requireAuth} from "../middleware/requireAuth.js";

export const authRouter = express.Router();

authRouter.post("/register", async (req, res) => {
    const { email, password, displayName, playerColor } = req.body;

    if (!email || !password || !displayName || !playerColor)
        return res.status(400).json({ error: "Invalid registration fields" });
    const isAdmin = req.headers.adminpassword === config.admin.admin_password
    console.log("ADMIN:" + isAdmin + "because admin password:" + config.admin.admin_password + "and give password:" + req.headers.AdminPassword)
    const userId = crypto.randomUUID();
    const playerId = crypto.randomUUID();
    const passwordHash = await argon2.hash(password);
    const dbClient = await db.connect();

    try {
        await dbClient.query("BEGIN");
        await dbClient.query(
            `INSERT INTO users (user_id, email, password_hash, is_admin)
            VALUES ($1, $2, $3, $4)`,
            [userId, email.trim().toLowerCase(), passwordHash, isAdmin]
        );

        const result = await dbClient.query(
            `INSERT INTO player_profiles (player_id, user_id, display_name, player_color)
            VALUES ($1, $2, $3, $4)
            RETURNING player_id, display_name, player_color`,
            [playerId, userId, displayName, playerColor]
        );
        await dbClient.query("COMMIT");
        if (isAdmin)
            res.status(201).json({
                message: "Admin created",
                profile: toProfileDto(result.rows[0])
            })
        else
            res.status(201).json({
                message: "User created",
                profile: toProfileDto(result.rows[0])
    })
    }
    catch (err) {
        await dbClient.query("ROLLBACK");
        console.error(err);
        res.status(500).json({ error: "Unable to register user" });
    }
    finally {
        dbClient.release();
    }
});

authRouter.post("/login", async (req, res) => {
    const { email, password, staySignedIn } = req.body;
    console.log("Login attempt with email:", email, "and password:", password);
    if (!email || !password)
        return res.status(400).json({ error: "Missing email or password" });

    try {
        const result = await db.query(
        `SELECT user_id, password_hash, is_admin
        FROM users
        WHERE email = $1`,
        [email.trim().toLowerCase()]
        )

        if (result.rowCount === 0)
            return res.status(401).json({ error: "Invalid credentials" });

        const user = result.rows[0];
        const isPasswordMatching = await argon2.verify(user.password_hash, password);

        if (!isPasswordMatching)
            return res.status(401).json({ error: "Invalid credentials" });

        const result2 = await db.query(
            `SELECT display_name
             FROM player_profiles
             WHERE user_id = $1`,
            [user.user_id]
        )
        if (result2.rowCount === 0)
            return res.status(401).json({error: "Invalid player profile"});
        const userName = result2.rows[0].display_name;

        const token = jwt.sign(
            { sub: user.user_id },
            config.jwt.secret,
            { expiresIn: config.jwt.expiration, algorithm: "HS256"}
        );
        let refreshToken = null

        if (staySignedIn) {
            refreshToken = jwt.sign(
                { sub: user.user_id },
                config.refreshToken.secret,
                { expiresIn: config.refreshToken.expiration, algorithm: "HS256"}
            );

            const hashedToken = crypto
                .createHash('sha256')
                .update(refreshToken)
                .digest('hex');

            const expiration = new Date();
            expiration.setDate(expiration.getDate() + config.refreshToken.expiration);

            await db.query(
                `INSERT INTO refresh_tokens (user_id, token_hash, expires_at) 
                VALUES ($1, $2, $3)`,
                [user.user_id, hashedToken, expiration]
            )

            console.log("Refresh token inserted into database");

            // Cookies.refreshToken is a better way to store it, but Unity handles them on a device basis
            // So it will be attached as a custom header
            /*
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: true,
                maxAge: config.refreshToken.expiration * 24 * 60 * 60 * 1000
            });
            */
        }

        if (!result.rows[0].is_admin) {
            res.status(200).json({
                accessToken: token,
                refreshToken: refreshToken,
                message: "Welcome " + userName,
            })
        }
        else {
            res.status(200).json({
                accessToken: token,
                refreshToken: refreshToken,
                message: "Welcome admin user " + userName,
            })
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Unable to log in" });
    }
})

authRouter.get("/users", async (req, res) => {
    try {
        const result = await db.query(
            `SELECT user_id, email, is_admin
            FROM users`
        )

        if (result.rowCount === 0)
            return res.status(404).json({ error: "Users not found" });

        return res.status(200).json(result.rows);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Unable to fetch users" });
    }
})

authRouter.delete("/users", requireAuth, requireAdmin, async (req, res) => {
    const email  = req.body.email;

    if (!email)
        return res.status(400).json({ error: "Invalid user email" });
    const dbClient = await db.connect();

    try {
        await dbClient.query("BEGIN");
        const userResult = await dbClient.query(
            `DELETE FROM users 
            WHERE email = $1
            RETURNING *`,
            [email]
        )

        if (userResult.rowCount === 0)
            return res.status(404).json({ error: "User not found" });

        const userId = userResult.rows[0].user_id;
        if (userId === null) {
            await dbClient.query("ROLLBACK");
            return res.status(404).json({error: "User ID not found. Very bad."});
        }
        // Because profiles are linked to users (foreign key), they're deleted on cascade
        await dbClient.query("COMMIT");
        res.status(200).json({ message: "User deleted successfully" });
    }
    catch (err) {
        await dbClient.query("ROLLBACK");
        console.error(err);
        res.status(500).json({ error: "Unable to delete user" });
    }
    finally {
        dbClient.release();
    }
})

authRouter.post("/refresh", async (req, res) => {
    const refreshToken = req.headers['X-Refresh-Token']

    if (refreshToken) {
        const hashedToken = crypto
            .createHash('sha256')
            .update(refreshToken)
            .digest('hex');

        try {
            const result = await db.query(
                `SELECT token_hash
                    FROM refresh_tokens
                    WHERE token_hash = $1 AND expires_at > NOW()`,
                [hashedToken]
            )

            if (result.rows.length === 0) {
                return res.status(401).json({ error: "Invalid refresh token" });
            }

            // Create new access token
            const user = result.rows[0];
            console.log("Creating new access token for user " + user.user_id)
            const token = jwt.sign(
                { sub: user.user_id },
                config.jwt.secret,
                { expiresIn: config.jwt.expiration, algorithm: "HS256"}
            )

            return res.status(200).json({ accessToken: token });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: "Unable to verify refresh token." })
        }
    }
})