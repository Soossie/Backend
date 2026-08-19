import express from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import { db } from "../db.js";
import { toProfileDto } from "../mappers.js";

export const profileRouter = express.Router();

profileRouter.get("/me", requireAuth, async (req, res) => {
    const userId = req.userId;

    try {
        const result = await db.query(
            `SELECT p.player_id, p.display_name, p.player_color
            FROM player_profiles p
            WHERE p.user_id = $1`,
            [userId]
        );

        if (result.rowCount === 0)
            return res.status(404).json({ error: "Profile not found." });

        res.status(200).json(toProfileDto(result.rows[0]));
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Unable to get profile." });
    }
});


profileRouter.patch("/me/color", requireAuth, (req, res) => {
    const userId = req.userId;

    try {

    }

    catch (err) {

    }
})

async function getPlayer(userId) {
    try {
        const result = await db.query(
            `SELECT p.player_id, p.display_name, p.player_color
            FROM player_profiles p
            WHERE p.user_id = $1`,
            [userId]
        );

        if (result.rowCount === 0)
            return res.status(404).json({ error: "Profile not found." });

        res.status(200).json(toProfileDto(result.rows[0]));
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Unable to get profile." });
    }
}
