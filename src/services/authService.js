import AxiosInstance from "./axios";

const authService = {
    checkAuth() {
        return AxiosInstance.get('/auth/checkauth')
            .then(response => response.data.isAuthenticated)
            .catch(() => false);
    },

    authorise() {
        return AxiosInstance.get('/auth/register');
    }
};

export default authService;