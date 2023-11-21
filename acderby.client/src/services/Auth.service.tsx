const login = (email: string, password: string) => {
    return fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ "email": email, "password": password }),
        credentials: "include"
    });
};

const logout = () => {
    return fetch("/api/logout");
};

const AuthService = {
    login,
    logout
}

export default AuthService;