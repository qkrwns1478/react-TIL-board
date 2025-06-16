const express = require("express");
const router = express.Router();
const db = require("../db");

/* 댓글 목록 */
router.get("/:postId/comments", async (req, res) => {
    const { postId } = req.params;
    try {
        const [rows] = await db.query(
            `
            SELECT 
                comments.id, 
                comments.content, 
                comments.created_at, 
                userinfo.name AS author,
                comments.author_id
            FROM comments
            JOIN userinfo ON comments.author_id = userinfo.id
            WHERE comments.post_id = ?
            ORDER BY comments.created_at ASC
        `,
            [postId]
        );
        res.json(rows);
    } catch (err) {
        console.error("댓글 조회 오류:", err);
        res.status(500).json({ error: "댓글을 가져오는 중 오류 발생" });
    }
});

/* 댓글 작성 */
router.post("/:postId/comments", async (req, res) => {
    const { postId } = req.params;
    const { author_id, content } = req.body;

    if (!author_id || !content) {
        return res.status(400).json({ error: "작성자와 내용은 필수입니다." });
    }

    try {
        await db.query(
            "INSERT INTO comments (post_id, author_id, content) VALUES (?, ?, ?)",
            [postId, author_id, content]
        );
        res.status(201).json({ message: "댓글 작성 완료" });
    } catch (err) {
        console.error("댓글 작성 오류:", err);
        res.status(500).json({ error: "댓글 작성 중 오류 발생" });
    }
});

/* 댓글 수정 */
router.put("/comments/:commentId", async (req, res) => {
    const { commentId } = req.params;
    const { author_id, content } = req.body;

    try {
        const [[comment]] = await db.query(
            `SELECT * FROM comments WHERE id = ?`,
            [commentId]
        );
        if (!comment) return res.status(404).json({ error: "댓글 없음" });
        if (comment.author_id !== author_id)
            return res.status(403).json({ error: "권한 없음" });

        await db.query(`UPDATE comments SET content = ? WHERE id = ?`, [
            content,
            commentId,
        ]);
        res.json({ message: "댓글 수정 완료" });
    } catch (err) {
        console.error("댓글 수정 오류:", err);
        res.status(500).json({ error: "댓글 수정 실패" });
    }
});

/* 댓글 삭제 */
router.delete("/comments/:commentId", async (req, res) => {
    const { commentId } = req.params;
    const { author_id } = req.body;

    try {
        const [[comment]] = await db.query(
            `SELECT * FROM comments WHERE id = ?`,
            [commentId]
        );
        if (!comment) return res.status(404).json({ error: "댓글 없음" });
        if (comment.author_id !== author_id)
            return res.status(403).json({ error: "권한 없음" });

        await db.query(`DELETE FROM comments WHERE id = ?`, [commentId]);
        res.json({ message: "댓글 삭제 완료" });
    } catch (err) {
        console.error("댓글 삭제 오류:", err);
        res.status(500).json({ error: "댓글 삭제 실패" });
    }
});

module.exports = router;
