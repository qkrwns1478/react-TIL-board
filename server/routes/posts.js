const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const pageSize = 10;
    const offset = (page - 1) * pageSize;

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
            LIMIT ? OFFSET ?
        `, [pageSize, offset]);

        const [countResult] = await db.query(
            `SELECT COUNT(*) AS total FROM posts`
        );
        const total = countResult[0].total;

        res.json({
            posts: rows,
            total,
            page,
            totalPages: Math.ceil(total / pageSize),
        });
    } catch (err) {
        console.error("DB 오류:", err);
        res.status(500).json({ error: "서버 오류" });
    }
});

module.exports = router;
