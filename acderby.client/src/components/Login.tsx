import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";


const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    function onFormSubmit(event: FormEvent) {
        event.preventDefault();

        return fetch('api/login?useCookies=true', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ "email": email, "password": password }),
            credentials: "include"
        }).then((resp) => {
            if (resp.status === 200) {
                fetch('api/roles').then((r) => r.json()).then((data) => {
                    const role = { role: data.role };
                    localStorage.setItem("userInfo", JSON.stringify(role));
                    navigate("/")
                })
            }
            else console.log(resp.statusText);
        },
        (error) => {
            console.log(error);
        });
    }

    return (
        <div className="content">
            <h1>Login</h1>
            <form onSubmit={onFormSubmit}>
                <input
                    required
                    type="text"
                    placeholder="Email"
                    name="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                />
                <input
                    required
                    type="password"
                    placeholder="Password"
                    name="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                />
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;