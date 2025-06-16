import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PostCreate = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const navigate = useNavigate();
    const authorId = useSelector((state) => state.auth.id);

    const handleSubmit = async () => {
        if (!title.trim() || !content.trim()) {
            alert("제목과 내용을 모두 입력하세요.");
            return;
        }

        const res = await fetch("/api/posts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title,
                content,
                author_id: authorId,
            }),
        });

        if (!res.ok) {
            const err = await res.json();
            alert("작성 실패: " + err.error);
            return;
        }

        const { id } = await res.json();
        navigate(`/posts/${id}`);
    };

    return (
        <div className="board-wrapper">
            <h2>새 TIL 작성</h2>
            <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="제목"
                style={{ width: "100%", padding: "8px", marginBottom: "1rem" }}
            />
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="내용"
                rows="10"
                style={{ width: "100%", padding: "8px" }}
            />
            <div style={{ marginTop: "1rem" }}>
                <button onClick={handleSubmit}>작성 완료</button>
                <button
                    onClick={() => navigate("/")}
                    style={{ marginLeft: "8px" }}
                >
                    취소
                </button>
            </div>
        </div>
    );
};

export default PostCreate;