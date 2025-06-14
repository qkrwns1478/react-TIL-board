import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import useLogout from "./app/logout";
import "./css/Header.css";
import logo from "./assets/logo.png";

function Header () {
    const handleLogout = useLogout();
    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
    // const username = useSelector((state) => state.auth.username);

    return (
        <header>
            <div>
                <div>
                    <Link to = "/">
                        <img src={logo} id="mainLogo"/>
                    </Link>
                </div>
                <nav>
                    <Link to="/about">About</Link> |{" "}
                    {isLoggedIn ? (
                        <>
                            마이페이지 | <Link onClick={handleLogout}>로그아웃</Link>
                        </>
                    ) : (
                        <>
                            <Link to="/login"><b>로그인</b></Link> | <Link to="/signup">회원가입</Link>
                        </>
                    )}
                </nav>
            </div>
        </header>

    );
}

export default Header;