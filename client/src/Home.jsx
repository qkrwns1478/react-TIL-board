import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "./css/Home.css";

function Home() {
    const [posts, setPosts] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [searchParams, setSearchParams] = useSearchParams();
    const page = parseInt(searchParams.get("page")) || 1;

    // const dispatch = useDispatch();
    // const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
    // const username = useSelector((state) => state.auth.username);

    const fetchPosts = async (pageNum) => {
        const res = await fetch(`/api/posts?page=${pageNum}`);
        const data = await res.json();
        setPosts(data.posts);
        setTotalPages(data.totalPages);
        setSearchParams({ page: pageNum });
    };

    const renderPagination = () => {
        const buttons = [];
        const maxPage = totalPages;
        const current = page;
        // 이전 버튼
        buttons.push(
            <button
            key="prev"
            onClick={() => fetchPosts(current - 1)}
            disabled={current === 1}
            className={current === 1 ? "disabled" : ""}
            >
            ◀︎ 이전
            </button>
        );
        // 1번 페이지
        buttons.push(
            <button key={1} onClick={() => fetchPosts(1)} className={current === 1 ? "active" : ""}>
                1
            </button>
        );
        // … 왼쪽
        if (current > 3) {
            buttons.push(<span key="start-ellipsis">…</span>);
        }
        // 현재 기준 ±1 페이지
        for (let i = current - 1; i <= current + 1; i++) {
            if (i > 1 && i < maxPage) {
                buttons.push(
                    <button
                        key={i}
                        onClick={() => fetchPosts(i)}
                        className={current === i ? "active" : ""}
                    >
                        {i}
                    </button>
                );
            }
        }
        // … 오른쪽
        if (current < maxPage - 2) {
            buttons.push(<span key="end-ellipsis">…</span>);
        }
        // 마지막 페이지
        if (maxPage > 1) {
            buttons.push(
                <button key={maxPage} onClick={() => fetchPosts(maxPage)} className={current === maxPage ? "active" : ""}>
                    {maxPage}
                </button>
            );
        }
        // 다음 버튼
        buttons.push(
            <button
            key="next"
            onClick={() => fetchPosts(current + 1)}
            disabled={current === maxPage}
            className={current === maxPage ? "disabled" : ""}
            >
            다음 ▶︎
            </button>
        );
        return <div className="pagination">{buttons}</div>;
    };

    useEffect(() => {
        fetchPosts(page);
    }, [page]);

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
                            <td>
                                <Link to={`/posts/${post.id}`} style={{ color: "#007bff", textDecoration: "none" }}>
                                    {post.title}
                                </Link>
                            </td>
                            <td>{post.author}</td>
                            <td>
                                {new Date(post.created_at).toLocaleString()}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="pagination-wrapper">
                {renderPagination()}
            </div>
        </div>
    );
}

export default Home;
