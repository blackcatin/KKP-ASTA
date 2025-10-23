import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

const api = axios.create({
    baseURL: apiUrl,
});

api.interceptors.request.use(
    (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
    const code = error.response?.data?.code;
    const message = error.response?.data?.message;
    const status = error.response?.status;

    if (
        code === "TOKEN_EXPIRED" ||
        code === "INVALID_TOKEN" ||
        code === "BLACKLISTED" ||
        message?.toLowerCase().includes("token") 
    ) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        window.location.href = "/login";
    }

    if (status === 401) {
        const role = localStorage.getItem("role");
        window.location.href = role ? "/unauthorized" : "/login";
        return Promise.reject(error);
    }

    return Promise.reject(error);
    }
);

export default api;
