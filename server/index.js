const express = require("express");
const app = express();
const port = 3000;

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
	// console.log(`${username}, ${password}`);
    res.status(500).json({ error: "Login failed" });
});
