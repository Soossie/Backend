import express from "express"
import { requireAuth } from "../middleware/requireAuth.js"
import { db } from "../db.js"
import { toProfileDto } from "../mappers.js"
import res from "express/lib/response.js"
import {requireAdmin} from "../middleware/requireAdmin.js";

export const profileRouter = express.Router()

profileRouter.get("/me", requireAuth, async (req, res) => {
    const userId = req.userId

    try {
        const result = await db.query(
            `SELECT p.player_id, p.display_name, p.player_color
            FROM player_profiles p
            WHERE p.user_id = $1`,
            [userId]
        );

        if (result.rowCount === 0)
            return res.status(404).json({ error: "Profile not found." })

        res.status(200).json(toProfileDto(result.rows[0]))
    }
    catch (err) {
        console.error(err)
        res.status(500).json({ error: "Unable to get profile." })
    }
});


profileRouter.patch("/me/color", requireAuth, async (req, res) => {
    const userId = req.userId
    const profile = getPlayer(userId)
    if (!profile)
        return
    const playerColor= req.body.playerColor;
    if (!playerColor)
        return res.status(400).json({ error: "Invalid color." });
    try {
        await db.query("BEGIN")
        await db.query(
            `UPDATE player_profiles
            SET player_color = $1
            WHERE user_id = $2`,
            [playerColor, userId]
        )
        await db.query("COMMIT")
        res.status(201).json({ message: "Color updated successfully to " + playerColor})
    }
    catch (err) {
        await db.query("ROLLBACK")
        console.error(err)
        res.status(500).json({ error: "Unable to update color." })
    }
})

profileRouter.get("/", requireAuth, requireAdmin, async (req, res) => {
    try {
        const result = await db.query(
            `SELECT player_id, display_name, player_color
            FROM player_profiles`
        );

        if (result.rowCount === 0)
            return res.status(404).json({ error: "Profiles not found." })

        res.status(200).json(result.rows)
    }
    catch (err) {
        console.error(err)
        res.status(500).json({ error: "Unable to get profile." })
    }
});

async function getPlayer(userId) {
    try {
        const result = await db.query(
            `SELECT p.player_id, p.display_name, p.player_color
            FROM player_profiles p
            WHERE p.user_id = $1`,
            [userId]
        );

        if (result.rowCount === 0)
            return res.status(404).json({ error: "Profile not found." })

        const profile = toProfileDto(result.rows[0])
        return profile
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Unable to get profile." })
    }
}
