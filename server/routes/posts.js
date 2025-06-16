const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                posts.id,
                posts.title,
                userinfo.name AS author,
                posts.created_at
            FROM posts
            JOIN userinfo ON posts.author_id = userinfo.id
            ORDER BY posts.id DESC
        `);
        res.json(rows);
    } catch (err) {
        console.error("DB 오류:", err);
        res.status(500).json({ error: "서버 오류" });
    }
});

module.exports = router;
