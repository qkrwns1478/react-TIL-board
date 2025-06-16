import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearAuth } from "../feat/authSlice";

const useLogout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = (e) => {
        e.preventDefault();
        fetch("/api/logout", { method: "POST" })
            .then(() => {
                dispatch(clearAuth());
                navigate("/", { replace: true });
                window.location.reload();
            })
            .catch((err) => {
                console.error("Logout failed:", err);
            });
    };

    return handleLogout;
};

export default useLogout;