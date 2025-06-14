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
        </div>
    );
}

export default Home;