import { db } from "../db.js"

export async function requireAdmin(req, res, next) {
    const userId = req.userId
    try {
        await db.query("BEGIN")
        const result = await db.query(
            `SELECT is_admin 
            FROM users 
            WHERE user_id = $1`,
            [userId]
        )
        const isAdmin = result.rows[0].is_admin
        if (result.rowCount === 0 || isAdmin === false)
            return res.status(401).json({ message: "Unauthorized" })
        next()
    }
    catch (err) {
        console.error(err)
        res.status(500).json({ message: "Internal Server Error" })
    }
}