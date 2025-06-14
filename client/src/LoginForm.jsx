import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "./feat/authSlice";
import { motion, AnimatePresence } from "framer-motion";
import whiteLogo from "./assets/logo-white.png";
import "./css/LoginForm.css";

function LoginForm() {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

    const path = location.pathname.replace('/', '') || 'about';
    const isAbout = path === 'about';
    const isSignup = path === 'signup';

    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPw, setConfirmPw] = useState("");

    useEffect(() => {
        if (!isAbout && isLoggedIn) navigate("/");
    }, [location.pathname, isLoggedIn, navigate, isAbout]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isSignup) {
            fetch("/api/sign-up", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, username, password, confirmPw }),
            })
                .then((res) => res.json().then((data) => ({ status: res.status, data })))
                .then(({ status }) => {
                    if (status === 201) {
                        alert("회원가입이 완료되었습니다. 로그인 해주세요.");
                        navigate("/login");
                    } else {
                        alert("회원가입 실패");
                    }
                });
        } else {
            fetch("/api/log-in", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            })
                .then((res) => res.json().then((data) => ({ status: res.status, data })))
                .then(({ status, data }) => {
                    if (status === 200) {
                        dispatch(setCredentials({ accessToken: data.accessToken, username: data.username }));
                        navigate("/");
                    } else {
                        alert("로그인 실패");
                    }
                });
        }
    };

    return (
        <div className="login_body">
            <div className="login">
                <motion.form layout className="login_form" onSubmit={handleSubmit}>
                    {isAbout ? (
                        <>
                            <img src={whiteLogo} id="logoWhite" alt="logo" />
                            <p>매일의 배움과 고민을 기록하고, 공유하고, 성장하세요</p>
                            <h2>어떤 기능이 있나요?</h2>
                            <div className="features">
                                <div className="feature">
                                    <h3>📝 Markdown 지원</h3>
                                    <p>코드 블록과 서식을 활용해 <br />깔끔하게 정리하세요.</p>
                                </div>
                                <div className="feature">
                                    <h3>🏷️ 태그 & 날짜</h3>
                                    <p>태그를 사용한 카테고리 분류, <br />날짜 자동 태깅</p>
                                </div>
                                <div className="feature">
                                    <h3>💬 댓글 기능</h3>
                                    <p>다른 사용자에게 피드백과<br /> 응원도 받을 수 있어요.</p>
                                </div>
                                <div className="feature">
                                    <h3>🔒 JWT 로그인</h3>
                                    <p>안전하게 로그인하고 내 글을 관리하세요.</p>
                                </div>
                            </div>
                            <h2>기록은 곧 성장입니다</h2>
                            <span>개발자는 늘 배우고, 실수하고, 다시 일어섭니다.<br />
                            <strong>TIL Board</strong>는 그 과정을 함께합니다.<br />
                            오늘의 당신이 내일의 당신을 성장시킵니다.</span>
                        </>
                    ) : (
                        <h1 className="login_title">{isSignup ? "회원가입" : "로그인"}</h1>
                    )}

                    <div className="login_inputs" style={{ overflow: "hidden" }}>
                        <AnimatePresence mode="wait">
                            {isSignup && (
                                <motion.div key="name" layout initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }} className="login_box">
                                    <input type="text" placeholder="이름" className="login_input" required value={name} onChange={(e) => setName(e.target.value)} />
                                    <i className="ri-account-circle-line"></i>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {!isAbout && (
                            <>
                                <motion.div layout className="login_box">
                                    <input type="text" placeholder="ID" className="login_input" required value={username} onChange={(e) => setUsername(e.target.value)} />
                                    <i className="ri-user-fill"></i>
                                </motion.div>
                                <motion.div layout className="login_box">
                                    <input type="password" placeholder="비밀번호" className="login_input" required value={password} onChange={(e) => setPassword(e.target.value)} />
                                    <i className="ri-lock-2-fill"></i>
                                </motion.div>
                            </>
                        )}

                        <AnimatePresence mode="wait">
                            {isSignup && (
                                <motion.div key="confirmPw" layout initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }} className="login_box">
                                    <input type="password" placeholder="비밀번호 재입력" className="login_input" required value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} />
                                    <i className="ri-lock-2-fill"></i>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <button
                        type={isAbout ? "button" : "submit"}
                        className="login_button"
                        onClick={() => {
                            if (isAbout) {
                                navigate(isLoggedIn ? "/" : "/signup");
                            }
                        }}
                    >
                        {isAbout
                            ? isLoggedIn
                                ? "오늘의 TIL 쓰러가기"
                                : "무료로 TIL 써보기"
                            : isSignup
                            ? "회원가입"
                            : "로그인"}
                    </button>

                    {!isAbout && (
                        <div className="login_register">
                            {isSignup ? (
                                <>이미 계정이 있으신가요? <Link to="/login">로그인</Link></>
                            ) : (
                                <>아직 회원이 아니신가요? <Link to="/signup">회원가입</Link></>
                            )}
                        </div>
                    )}
                </motion.form>
            </div>
        </div>
    );
}

export default LoginForm;
