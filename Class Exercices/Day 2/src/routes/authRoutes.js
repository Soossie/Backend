import express from "express";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import crypto from "node:crypto";
import { config } from "../config.js";
import { db } from "../db.js";
import { toProfileDto } from "../mappers.js";

export const authRouter = express.Router();

authRouter.post("/register", async (req, res) => {
    const { email, password, displayName, playerColor } = req.body;

    if (!email || !password || !displayName || !playerColor)
        return res.status(400).json({ error: "Invalid registration fields" });

    const userId = crypto.randomUUID();
    const playerId = crypto.randomUUID();
    const passwordHash = await argon2.hash(password);
    const dbClient = await db.connect();

    try {
        await dbClient.query("BEGIN");
        await dbClient.query(
            `INSERT INTO users (user_id, email, password_hash)
            VALUES ($1, $2, $3)`,
            [userId, email.trim().toLowerCase(), passwordHash]
        );
        const result = await dbClient.query(
            `INSERT INTO player_profiles (player_id, user_id, display_name, player_color)
            VALUES ($1, $2, $3, $4)
            RETURNING player_id, display_name, player_color`,
            [playerId, userId, displayName, playerColor]
        );
        await dbClient.query("COMMIT");
        res.status(201).json(toProfileDto(result.rows[0]));
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
    const { email, password } = req.body;

    if (!email || !password)
        return res.status(400).json({ error: "Missing email or password" });

    try {
        const result = await db.query(
        `SELECT user_id, password_hash
        FROM users
        WHERE email = $1`,
        [email.trim().toLowerCase()]
        );

        if (result.rowCount === 0)
            return res.status(401).json({ error: "Invalid credentials" });

        const user = result.rows[0];
        const isPasswordMatching = await argon2.verify(user.password_hash, password);

        if (!isPasswordMatching)
            return res.status(401).json({ error: "Invalid credentials" });
        
        const token = jwt.sign(
            { sub: user.user_id },
            config.jwt.secret,
            { expiresIn: config.jwt.expiration, algorithm: "HS256"}
        );
        res.status(200).json({ accessToken: token });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Unable to log in" });
    }
});
