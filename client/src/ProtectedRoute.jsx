import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {
    const accessToken = useSelector((state) => state.auth.accessToken);

    if (accessToken === undefined) {
        return null;
    }
    if (!accessToken) {
        alert("로그인 후 이용해주세요.");
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}

export default ProtectedRoute;