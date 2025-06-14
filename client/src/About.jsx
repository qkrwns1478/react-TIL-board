import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import "./css/LoginForm.css";
import "./css/About.css";
import whiteLogo from "./assets/logo-white.png";

function About() {
    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
    return (
        <div className="login_body">
            <div className="login">
                <div className="login_form">
                        <img src={whiteLogo} id="logoWhite"/>
                        <p>매일의 배움과 고민을 기록하고, 공유하고, 성장하세요</p>
                        <h2>어떤 기능이 있나요?</h2>
                        <div class="features">
                            <div class="feature">
                                <h3>📝 Markdown 지원</h3>
                                <p>
                                    코드 블록과 서식을 활용해 깔끔하게 정리하세요.
                                </p>
                            </div>
                            <div class="feature">
                                <h3>🏷️ 태그 & 날짜</h3>
                                <p>
                                    태그를 사용한 카테고리 분류, 날짜 자동 태깅
                                </p>
                            </div>
                            <div class="feature">
                                <h3>💬 댓글 기능</h3>
                                <p>
                                    다른 사용자에게 피드백을 받고, 응원도 받을 수 있어요.
                                </p>
                            </div>
                            <div class="feature">
                                <h3>🔒 JWT 로그인</h3>
                                <p>안전하게 로그인하고 내 글을 관리하세요.</p>
                            </div>
                        </div>
                        <h2>기록은 곧 성장입니다</h2>
                        <p>개발자는 늘 배우고, 실수하고, 다시 일어섭니다.</p>
                        <p><strong>TIL Board</strong>는 그 과정을 함께합니다.</p>
                        <p>오늘의 당신이 내일의 당신을 성장시킵니다.</p>
                        <div>
                        {!isLoggedIn ?
                            <Link to="/signup"><button class="cta-btn">무료로 TIL 써보기</button></Link>
                        : null }
                        </div>
                </div>
            </div>
        </div>
    );
}

export default About;
