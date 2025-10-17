// src/store/api.js
async function apiFetch(url, options = {}) {
    options.headers = options.headers || {};
    options.headers['Content-Type'] = options.headers['Content-Type'] || 'application/json';

    const token = localStorage.getItem("token");
    if (token) {
        options.headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(url, options);

    if (res.status >= 400) {
        const errorBody = await res.json().catch(() => ({ message: 'An unknown error occurred' }));
        const error = new Error(errorBody.message || 'Something went wrong');
        error.response = res;
        error.errors = errorBody.errors; // FluentValidation hataları için
        throw error;
    }
    
    // Cevap gövdesi boş olabileceğinden (örn: 204 No Content) kontrol ekleyelim
    if (res.status === 204) {
        return res;
    }

    return res.json();
}

export default apiFetch;