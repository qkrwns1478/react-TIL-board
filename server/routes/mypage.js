const express = require("express");
const router = express.Router();
const db = require("../db");
const jwt = require("jsonwebtoken");
const { ACCESS_SECRET } = require("../auth");

router.get("/", async (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "인증 토큰이 없습니다." });
    }

    const token = authHeader.split(" ")[1];

    let userId;
    try {
        const decoded = jwt.verify(token, ACCESS_SECRET);
        userId = decoded.id;
    } catch (err) {
        return res.status(403).json({ message: "토큰 검증 실패" });
    }

    try {
        const [userRows] = await db.query(
            `SELECT id, username, name FROM userinfo WHERE id = ?`,
            [userId]
        );

        if (userRows.length === 0) {
            return res
                .status(404)
                .json({ message: "사용자를 찾을 수 없습니다." });
        }

        // const [postRows] = await db.query(
        //     `SELECT id, title, created_at FROM posts WHERE author_id = ? ORDER BY created_at DESC`,
        //     [userId]
        // );

        // res.json({
        //     user: userRows[0],
        //     posts: postRows,
        // });
        const page = parseInt(req.query.page) || 1;
        const pageSize = 10;
        const offset = (page - 1) * pageSize;

        const [[{ count }]] = await db.query(
            `SELECT COUNT(*) as count FROM posts WHERE author_id = ?`,
            [userId]
        );

        const [postRows] = await db.query(
                `SELECT id, title, created_at FROM posts
                WHERE author_id = ?
                ORDER BY created_at DESC
                LIMIT ? OFFSET ?`,
            [userId, pageSize, offset]
        );

        res.json({
            user: userRows[0],
            posts: postRows,
            totalPages: Math.ceil(count / pageSize),
            postCount: count,
        });
    } catch (err) {
        console.error("마이페이지 에러:", err);
        res.status(500).json({ message: "서버 에러" });
    }
});

module.exports = router;
