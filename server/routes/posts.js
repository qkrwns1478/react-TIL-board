const express = require("express");
const router = express.Router();
const db = require("../db");

/* 게시글 리스트 */
router.get("/", async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const pageSize = 10;
    const offset = (page - 1) * pageSize;
    const tag = req.query.tag;

    try {
        let rows, countResult;

        if (tag) {
            [rows] = await db.query(
                `
                SELECT 
                    posts.id,
                    posts.title,
                    userinfo.name AS author,
                    posts.created_at
                FROM posts
                JOIN userinfo ON posts.author_id = userinfo.id
                JOIN post_tags ON posts.id = post_tags.post_id
                JOIN tags ON post_tags.tag_id = tags.id
                WHERE tags.name = ?
                ORDER BY posts.id DESC
                LIMIT ? OFFSET ?
            `,
                [tag, pageSize, offset]
            );

            [countResult] = await db.query(
                `
                SELECT COUNT(*) AS total
                FROM posts
                JOIN post_tags ON posts.id = post_tags.post_id
                JOIN tags ON post_tags.tag_id = tags.id
                WHERE tags.name = ?
            `,
                [tag]
            );
        } else {
            [rows] = await db.query(
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

            [countResult] = await db.query(
                `SELECT COUNT(*) AS total FROM posts`
            );
        }

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

/* 게시글 작성 */
router.post("/", async (req, res) => {
    const { title, content, author_id, tags } = req.body;

    if (!title || !content || !author_id) {
        return res.status(400).json({ error: "모든 항목은 필수입니다." });
    }

    try {
        const [result] = await db.query(
            `INSERT INTO posts (title, content, author_id) VALUES (?, ?, ?)`,
            [title, content, author_id]
        );

        const postId = result.insertId;

        for (const tagName of tags) {
            const [[existing]] = await db.query(
                `SELECT id FROM tags WHERE name = ?`,
                [tagName]
            );

            const tagId =
                existing?.id ||
                (
                    await db.query(`INSERT INTO tags (name) VALUES (?)`, [
                        tagName,
                    ])
                )[0].insertId;

            await db.query(
                `INSERT INTO post_tags (post_id, tag_id) VALUES (?, ?)`,
                [postId, tagId]
            );
        }

        res.status(201).json({ message: "작성 완료", id: result.insertId });
    } catch (err) {
        console.error("게시글 작성 오류:", err);
        res.status(500).json({ error: "서버 오류" });
    }
});

/* 게시글 수정 */
router.put("/:postId", async (req, res) => {
    const { postId } = req.params;
    const { title, content, author_id, tags } = req.body;
    const [[post]] = await db.query(
        `SELECT author_id FROM posts WHERE id = ?`,
        [postId]
    );
    if (!post) return res.status(404).json({ error: "게시글 없음" });
    if (post.author_id !== author_id)
        return res.status(403).json({ error: "수정 권한 없음" });
    await db.query(
        `UPDATE posts SET title = ?, content = ?, updated_at = NOW() WHERE id = ?`,
        [title, content, postId]
    );
    await db.query(`DELETE FROM post_tags WHERE post_id = ?`, [postId]);
    for (const tagName of tags) {
        const [[existing]] = await db.query(
            `SELECT id FROM tags WHERE name = ?`,
            [tagName]
        );

        const tagId =
            existing?.id ||
            (await db.query(`INSERT INTO tags (name) VALUES (?)`, [tagName]))[0]
                .insertId;

        await db.query(
            `INSERT INTO post_tags (post_id, tag_id) VALUES (?, ?)`,
            [postId, tagId]
        );
    }
    res.json({ message: "수정 완료" });
});

/* 게시글 삭제 */
router.delete("/:postId", async (req, res) => {
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
    res.status(200).json({ message: "삭제 완료" });
});

/* 게시글 태그 조회 */
router.get("/:postId/tags", async (req, res) => {
    const { postId } = req.params;

    try {
        const [rows] = await db.query(
            `
        SELECT tags.id, tags.name 
        FROM tags
        JOIN post_tags ON tags.id = post_tags.tag_id
        WHERE post_tags.post_id = ?
        `,
            [postId]
        );
        res.json(rows);
    } catch (err) {
        console.error("태그 조회 오류:", err);
        res.status(500).json({ error: "태그 조회 실패" });
    }
});

module.exports = router;
