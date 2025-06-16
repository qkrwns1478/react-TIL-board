import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PostEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const authorId = useSelector((state) => state.auth.id);

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    useEffect(() => {
        fetch(`/api/posts/${id}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.author_id !== authorId) {
                    alert("작성자만 수정할 수 있습니다.");
                    navigate("/");
                } else {
                    setTitle(data.title);
                    setContent(data.content);
                }
            });
    }, [id, authorId, navigate]);

    const handleUpdate = async () => {
        if (!title.trim() || !content.trim()) {
            alert("제목과 내용을 입력하세요.");
            return;
        }
        await fetch(`/api/posts/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title,
                content,
                author_id: authorId,
            }),
        });
        alert("게시글이 수정되었습니다.");
        navigate(`/posts/${id}`);
    };

    return (
        <div className="board-wrapper">
            <h2>게시글 수정</h2>
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
                <button onClick={handleUpdate}>저장</button>
                <button onClick={() => navigate(`/posts/${id}`)}>취소</button>
            </div>
        </div>
    );
};

export default PostEdit;
