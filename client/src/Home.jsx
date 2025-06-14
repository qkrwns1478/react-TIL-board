import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { increment } from "./feat/counterSlice";
import munsikLogo from "./assets/munsik.png";
import "./css/Home.css";

function Home() {
    const [msg, setMsg] = useState("");
    const [animate, setAnimate] = useState(false);

    const dispatch = useDispatch();
    const count = useSelector((state) => state.counter.value);
    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
    const username = useSelector((state) => state.auth.username);

    useEffect(() => {
        fetch("/api/hello")
            .then((res) => res.json())
            .then((data) => setMsg(data.message));
    }, []);

    const handleClick = () => {
        dispatch(increment());
        setAnimate(true);
        setTimeout(() => setAnimate(false), 400);
    };

    return (
        <div>
            <h1>Home</h1>
            <div>
                <img src={munsikLogo} className={animate ? "logo animate-grow-shrink" : "logo"} />
            </div>
            <div className="card">
                <button onClick={handleClick}>
                    count is {count}
                </button>
                <p>
                    Edit <code>src/App.jsx</code> and save to test HMR
                </p>
            </div>
            <p className="read-the-docs">
                {msg}
            </p>
            <div>
                {isLoggedIn ? (
                    <p>{username}님 안녕하세요!</p>
                ) : (
                    <p>로그인이 필요합니다.</p>
                )}
            </div>
        </div>
    );
}

export default Home;