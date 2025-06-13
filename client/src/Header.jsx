import { Link } from "react-router-dom";
import "./css/Header.css";

function Header ({ loggedIn }) {
    console.log("loggedIn = " + loggedIn);
    if (loggedIn) {
        return (
            <header>
                <div>
                    <nav>
                        <Link to="/">HOME</Link> | <Link to="">로그아웃</Link>
                    </nav>
                </div>
            </header>
        );
    }
    return (
        <header>
            <div>
                <nav>
                    <Link to="/">HOME</Link> | <Link to="/login">로그인</Link> | <Link to="/signup">회원가입</Link>
                </nav>
            </div>
        </header>
    );
}

export default Header;