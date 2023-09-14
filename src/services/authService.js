import AxiosInstance from "./axios";

const AuthService = {
    checkAuth() {
        return AxiosInstance.get('/auth/check-auth')
            .then(response => response.data.isAuthenticated)
            .catch(() => false);
    },

    authorise() {
        return AxiosInstance.get('/auth/register');
    }
};

export default AuthService;