// src/store/api.js
async function apiFetch(url, options = {}) {
    options.headers = options.headers || {};

    const token = localStorage.getItem("token");
    if (token) {
        options.headers["Authorization"] = `Bearer ${token}`;
    }

    // Vite proxy sayəsində tam URL yazmağa ehtiyac yoxdur
    const res = await fetch(url, options);

    if (res.status >= 400) throw res;
    return res;
}

export default apiFetch;