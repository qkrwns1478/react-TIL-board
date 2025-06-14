import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearAuth } from "./feat/authSlice";
import "./css/Header.css";

function Header () {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
    const username = useSelector((state) => state.auth.username);

    const handleLogout = (e) => {
        e.preventDefault();
        fetch("/api/logout", { method: "POST" })
        .then(() => {
            dispatch(clearAuth());
            navigate("/");
        });
    };

    if (isLoggedIn) {
        return (
            <header>
                <div>
                    <nav>
                        <Link to="/">HOME</Link> | <Link onClick={handleLogout}>로그아웃</Link>
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