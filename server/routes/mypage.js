const express = require("express");
const router = express.Router();
const db = require("../db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { generateAccessToken, generateRefreshToken, ACCESS_SECRET } = require("../auth");

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

/* 프로필 수정 */
router.put("/edit", async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
        return res.status(401).json({ message: "토큰이 없습니다." });
    }

    const token = authHeader.split(" ")[1];
    let userId;
    try {
        const decoded = jwt.verify(token, ACCESS_SECRET);
        userId = decoded.id;
    } catch (err) {
        return res.status(403).json({ message: "토큰 검증 실패" });
    }

    const { name, currentPassword, newPassword } = req.body;

    try {
        const [[user]] = await db.query(
            `SELECT password FROM userinfo WHERE id = ?`,
            [userId]
        );

        if (!user) {
            return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
        }

        // 이름만 변경하는 경우
        if (!newPassword) {
            await db.query(`UPDATE userinfo SET name = ? WHERE id = ?`, [name, userId]);
            // 토큰 재발급
            const [[userinfo]] = await db.query(
                `SELECT * FROM userinfo WHERE id = ?`,
                [userId]
            );
            console.log(`[Server] ${userinfo.username}'s name is changed to ${userinfo.name}`);
            const payload = { id: userinfo.id, username: userinfo.username, name: userinfo.name };
            const accessToken = generateAccessToken(payload);
            const refreshToken = generateRefreshToken(payload);
            return res.status(200)
                .cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                    secure: false, // 실제 배포할 때 true로 변경해야 함
                    sameSite: "lax",
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                })
                .json({ 
                    message: "이름 변경 완료",
                    accessToken: accessToken,
                    id: userinfo.id,
                    username: userinfo.username,
                    name: userinfo.name
            });
        }

        // 비밀번호도 변경하려면 현재 비밀번호 확인
        const match = await bcrypt.compare(currentPassword, user.password);
        if (!match) {
            return res.status(403).json({ message: "현재 비밀번호가 일치하지 않습니다." });
        }

        const hashed = await bcrypt.hash(newPassword, 10);

        await db.query(
            `UPDATE userinfo SET password = ? WHERE id = ?`,
            [hashed, userId]
        );

        res.status(200).json({ message: "이름/비밀번호 변경 완료" });
    } catch (err) {
        console.error("프로필 수정 오류:", err);
        res.status(500).json({ message: "서버 오류" });
    }
});

/* 회원 탈퇴 */
router.delete("/delete", async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
        return res.status(401).json({ message: "토큰이 없습니다." });
    }

    const token = authHeader.split(" ")[1];
    let userId;
    let username;
    try {
        const decoded = jwt.verify(token, ACCESS_SECRET);
        userId = decoded.id;
        username = decoded.username;
    } catch (err) {
        return res.status(403).json({ message: "토큰 검증 실패" });
    }

    try {
        await db.query(`DELETE FROM userinfo WHERE id = ?`, [userId]);
        console.log(`[Server] ${username} deleted the account.`);
        res.clearCookie("refreshToken");
        res.status(200).json({ message: "회원 탈퇴 완료" });
    } catch (err) {
        console.error("회원 탈퇴 오류:", err);
        res.status(500).json({ message: "서버 오류" });
    }
});

module.exports = router;
