import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./css/Home.css";

function Home() {
    // const [msg, setMsg] = useState("");
    const [posts, setPosts] = useState([]);

    // const dispatch = useDispatch();
    // const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
    // const username = useSelector((state) => state.auth.username);

    useEffect(() => {
        fetch("/api/posts")
            .then((res) => res.json())
            .then((data) => setPosts(data));
    }, []);

    return (
        <div className="board-wrapper">
            <h1 className="board-title">TIL Board</h1>
            <table className="board-table">
                <thead>
                    <tr>
                        <th>번호</th>
                        <th>제목</th>
                        <th>작성자</th>
                        <th>작성일</th>
                    </tr>
                </thead>
                <tbody>
                    {posts.map((post) => (
                        <tr key={post.id}>
                            <td>{post.id}</td>
                            <td>{post.title}</td>
                            <td>{post.author}</td>
                            <td>
                                {new Date(post.created_at).toLocaleString()}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Home;
