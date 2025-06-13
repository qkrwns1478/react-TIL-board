const express = require("express");
const app = express();
const port = 3000;
const db = require("./db.js");
const bcrypt = require("bcryptjs");

app.get("/api/hello", (req, res) => {
    res.json({ message: "Hello from Express!" });
});

app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
});

app.use(express.json());

/* 로그인 */
app.post("/api/log-in", (req, res) => {
    const { username, password } = req.body;
    db.query("SELECT * FROM USERINFO WHERE username = ?", [username])
        .then(([rows]) => {
            if (rows.length === 0) {
                return res.status(401).json({ error: "Invalid ID" });
            }

            const user = rows[0];
            const isPwCorrect = bcrypt.compareSync(password, user.password);
            if (!isPwCorrect) {
                return res.status(401).json({ error: "Invalid password" });
            }
            return res.status(200).json({
                username: user.username,
                message: "Login success",
            });
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: "Server error" });
        });
});

/* 회원가입 */
app.post("/api/sign-up", (req, res) => {
    const { name, username, password, confirmPw } = req.body;

    /* 비밀번호 확인 */
    if (password !== confirmPw) {
        return res.status(400).json({ error: "Invalid password" });
    }

    /* 중복 아이디 체크 */
    db.query("SELECT * FROM USERINFO WHERE username = ?", [username])
        .then(([rows]) => {
            if (rows.length > 0) {
                return res.status(409).json({ error: "Conflict username" });
            }

            /* 비밀번호 암호화 */
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(password, salt);

            /* DB에 회원 정보 추가 */
            return db.query(
                "INSERT INTO USERINFO (name, username, password) VALUES (?, ?, ?)",
                [name, username, hash]
            );
        })
        .then(() => {
            if (!res.headersSent) {
                res.status(201).json({ message: "User created" });
            }
        })
        .catch((err) => {
            console.error("Error occurred on sign-up:", err);
            if (!res.headersSent) {
                res.status(500).json({ error: "Server error" });
            }
        });
});
