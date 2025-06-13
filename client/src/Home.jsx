import { useEffect, useState } from "react";
import munsikLogo from "./assets/munsik.png";
import "./css/Home.css";

function Home() {
    const [count, setCount] = useState(0);
    const [msg, setMsg] = useState("");

    useEffect(() => {
        fetch("/api/hello")
            .then((res) => res.json())
            .then((data) => setMsg(data.message));
    }, []);

    const [animate, setAnimate] = useState(false);

    const handleClick = () => {
        setCount((count) => count + 1);
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