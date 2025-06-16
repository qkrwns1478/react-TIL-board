import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import MarkdownEditor from "./MarkdownEditor";

const PostCreate = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const navigate = useNavigate();

    const [checkingLogin, setCheckingLogin] = useState(true);
    const authorId = useSelector((state) => state.auth.id);

    // useEffect(() => {
    //     if (checkingLogin && authorId === null) return;
    //     if (!authorId) {
    //         alert("로그인 후 이용해주세요.");
    //         navigate("/login");
    //         return;
    //     }
    //     setCheckingLogin(false);
    // }, [authorId, checkingLogin, navigate]);

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
            <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="제목"
                style={{ width: "100%", padding: "8px", marginBottom: "1rem" }}
            />
            <MarkdownEditor content={content} setContent={setContent} />
            <div style={{ marginTop: "1rem" }}>
                <button onClick={handleSubmit}>저장</button>
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
