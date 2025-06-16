const express = require("express");
const router = express.Router();
const db = require("../db");

/* 게시글 리스트 */
router.get("/", async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const pageSize = 10;
    const offset = (page - 1) * pageSize;

    try {
        const [rows] = await db.query(
            `
            SELECT 
                posts.id,
                posts.title,
                userinfo.name AS author,
                posts.created_at
            FROM posts
            JOIN userinfo ON posts.author_id = userinfo.id
            ORDER BY posts.id DESC
            LIMIT ? OFFSET ?
        `,
            [pageSize, offset]
        );

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

/* 게시글 보기 */
router.get("/:id", async (req, res) => {
    const postId = req.params.id;

    try {
        const [rows] = await db.query(
            `
        SELECT 
            posts.id,
            posts.title,
            posts.content,
            posts.author_id,
            userinfo.name AS author,
            posts.created_at
        FROM posts
        JOIN userinfo ON posts.author_id = userinfo.id
        WHERE posts.id = ?
        `,
            [postId]
        );

        if (rows.length === 0)
            return res
                .status(404)
                .json({ error: "게시글을 찾을 수 없습니다." });

        res.json(rows[0]);
    } catch (err) {
        console.error("상세 조회 오류:", err);
        res.status(500).json({ error: "서버 오류" });
    }
});

/* 게시글 삭제 */
router.delete("/posts/:postId", async (req, res) => {
    const { postId } = req.params;
    const { author_id } = req.body;

    const [[post]] = await db.query(
        `SELECT author_id FROM posts WHERE id = ?`,
        [postId]
    );

    if (!post) return res.status(404).json({ error: "게시글 없음" });
    if (post.author_id !== author_id)
        return res.status(403).json({ error: "권한 없음" });

    await db.query(`DELETE FROM posts WHERE id = ?`, [postId]);
    res.json({ message: "삭제 완료" });
});

module.exports = router;
