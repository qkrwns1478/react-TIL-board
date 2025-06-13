import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./css/Login.css";

function Signup () {
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    return (
        <div className="login_body">
            <div className="login">
                <form className="login_form">
                    <h1 className="login_title">회원가입</h1>
                    <div className="login_inputs">
                        <div className="login_box">
                            <input
                                type="text"
                                placeholder="이름"
                                required
                                className="login_input"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <i class="ri-account-circle-line"></i>
                        </div>

                        <div className="login_box">
                            <input
                                type="text"
                                placeholder="ID"
                                required
                                className="login_input"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            <i className="ri-user-fill"></i>
                        </div>

                        <div className="login_box">
                            <input
                                type="password"
                                placeholder="비밀번호"
                                required
                                className="login_input"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <i className="ri-lock-2-fill"></i>
                        </div>

                        <div className="login_box">
                            <input
                                type="password"
                                placeholder="비밀번호 재입력"
                                required
                                className="login_input"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <i className="ri-lock-2-fill"></i>
                        </div>
                    </div>

                    <button type="submit" className="login_button">
                        회원가입
                    </button>

                    <div className="login_register">
                        이미 계정이 있으신가요? <Link to="/login">로그인</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Signup;