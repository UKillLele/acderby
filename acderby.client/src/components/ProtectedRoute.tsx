import { Outlet, useNavigate } from "react-router-dom";


const EditorRoutes = () => {
    const navigate = useNavigate();
    const signedIn = decodeURIComponent(document.cookie).includes(".AspNetCore.Identity.Application");
    const userInfo = localStorage.getItem("userInfo");
    let role;
    if (userInfo) {
        role = JSON.parse(userInfo).role;
        if (!signedIn || (role !== "Admin" && role !== "Editor")) {
            navigate("/not-found");
        }
        return (
            <Outlet />
        );
    }
};

export default EditorRoutes;