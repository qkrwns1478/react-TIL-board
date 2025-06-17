import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import "./css/Mypage.css";
import deletePost from "./app/deletePost";
import shortenWords from "./feat/shortenWords";

function Mypage() {
    const navigate = useNavigate();
    const { accessToken, username, name, id } = useSelector((state) => state.auth);
    const [userPosts, setUserPosts] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [postCount, setPostCount] = useState(1);
    const [searchParams, setSearchParams] = useSearchParams();
    const page = parseInt(searchParams.get("page")) || 1;

    const fetchMyPosts = async (pageNum) => {
        const res = await fetch(`/api/mypage?page=${pageNum}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        const data = await res.json();
        setUserPosts(data.posts);
        setTotalPages(data.totalPages || 1);
        setSearchParams({ page: pageNum });
        setPostCount(data.postCount);
    };

    const renderPagination = () => {
        const buttons = [];
        const maxPage = totalPages;
        const current = page;

        buttons.push(
            <button
                key="prev"
                onClick={() => fetchMyPosts(current - 1)}
                disabled={current === 1}
                className={current === 1 ? "disabled" : ""}
            >
                ◀ 이전
            </button>
        );

        if (maxPage <= 5) {
            for (let i = 1; i <= maxPage; i++) {
                buttons.push(
                    <button
                        key={i}
                        onClick={() => fetchMyPosts(i)}
                        className={current === i ? "active" : ""}
                    >
                        {i}
                    </button>
                );
            }
        } else {
            buttons.push(
                <button
                    key={1}
                    onClick={() => fetchMyPosts(1)}
                    className={current === 1 ? "active" : ""}
                >
                    1
                </button>
            );
            if (current > 3) buttons.push(<span key="start-ellipsis">…</span>);
            for (let i = current - 1; i <= current + 1; i++) {
                if (i > 1 && i < maxPage) {
                    buttons.push(
                        <button
                            key={i}
                            onClick={() => fetchMyPosts(i)}
                            className={current === i ? "active" : ""}
                        >
                            {i}
                        </button>
                    );
                }
            }
            if (current < maxPage - 2) buttons.push(<span key="end-ellipsis">…</span>);
            buttons.push(
                <button
                    key={maxPage}
                    onClick={() => fetchMyPosts(maxPage)}
                    className={current === maxPage ? "active" : ""}
                >
                    {maxPage}
                </button>
            );
        }

        buttons.push(
            <button
                key="next"
                onClick={() => fetchMyPosts(current + 1)}
                disabled={current === maxPage}
                className={current === maxPage ? "disabled" : ""}
            >
                다음 ▶
            </button>
        );

        return <div className="pagination">{buttons}</div>;
    };

    useEffect(() => {
        if (!accessToken) return;
        fetchMyPosts(page);

        // fetch("/api/mypage", {
        //     headers: {
        //         Authorization: `Bearer ${accessToken}`,
        //     },
        // })
        //     .then((res) => res.json())
        //     .then((data) => {
        //         setUserPosts(data.posts);
        //     });
    }, [accessToken, page]);

    const handleEditProfile = () => navigate("/mypage/edit");

    const handleDeletePost = async (postId) => {
        const ok = window.confirm(
            "정말 게시글을 삭제하시겠습니까? 삭제 후에는 복원할 수 없습니다."
        );
        if (!ok) return;

        try {
            await deletePost(postId, id);
            alert("삭제가 완료되었습니다.");
            navigate("/mypage");
        } catch (err) {
            alert("삭제에 실패했습니다.");
        }
    };

    return (
        <div className="login_body" style={{ paddingTop: "80px", paddingBottom: "80px" }}>
        <div className="mypage-container">
            <h1 className="mypage-title">마이페이지</h1>

            <div className="user-info">
                <div className="user-details" style={{ textAlign: "Left" }}>
                    <p className="user-name">{`이름: ${name}`}</p>
                    <p className="user-id">{`ID: ${username}`}</p>
                </div>
                <button className="edit-button" onClick={handleEditProfile}>
                    프로필 수정
                </button>
            </div>

            <div className="user-posts">
                <h2>내가 쓴 글 ({postCount})</h2>
                {userPosts.length === 0 ? (
                    <p className="no-posts">작성한 글이 없습니다.</p>
                ) : (
                    <table className="board-table">
                        <thead>
                            <tr>
                                <th>제목</th>
                                <th>작성일</th>
                                <th>관리</th>
                            </tr>
                        </thead>
                        <tbody>
                            {userPosts.map((post) => (
                                <tr key={post.id} className="post-row">
                                    <td
                                        onClick={() =>navigate(`/posts/${post.id}`)}
                                        style={{ cursor: "pointer" }}
                                    >{shortenWords(post.title, 20)}</td>
                                    <td>
                                        {new Date(post.created_at).toLocaleDateString()}
                                    </td>
                                    <td>
                                    <Link to={`/posts/${post.id}/edit`}>
                                        <button style={{ marginRight: "6px" }}>수정</button>
                                    </Link>
                                    <button onClick={() => handleDeletePost(post.id)}>삭제</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
                {userPosts.length > 0 && renderPagination()}
            </div>
        </div>
        </div>
    );
}

export default Mypage;
