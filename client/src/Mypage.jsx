import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import "./css/Mypage.css";
import deletePost from "./app/deletePost";
import shortenWords from "./feat/shortenWords";

function Mypage() {
    const navigate = useNavigate();
    const { accessToken, username, name, id } = useSelector(
        (state) => state.auth
    );

    const [userPosts, setUserPosts] = useState([]);

    useEffect(() => {
        if (!accessToken) return;

        fetch("/api/mypage", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setUserPosts(data.posts);
            });
    }, [accessToken]);

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
                <h2>내가 쓴 글 ({userPosts.length})</h2>
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
            </div>
        </div>
        </div>
    );
}

export default Mypage;
