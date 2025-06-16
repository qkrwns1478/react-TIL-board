import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./css/Mypage.css";

function Mypage() {
    const navigate = useNavigate();
    const { accessToken, name, username } = useSelector(
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

    return (
        <div className="mypage-container">
            <h1 className="mypage-title">마이페이지</h1>

            <div className="user-info">
                <div className="user-details">
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
                            </tr>
                        </thead>
                        <tbody>
                            {userPosts.map((post) => (
                                <tr
                                    key={post.id}
                                    className="post-row"
                                    onClick={() =>
                                        navigate(`/posts/${post.id}`)
                                    }
                                    style={{ cursor: "pointer" }}
                                >
                                    <td>{post.title}</td>
                                    <td>
                                        {new Date(
                                            post.created_at
                                        ).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

export default Mypage;
