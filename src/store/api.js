// API üçün əsas URL-i .env faylından götürürük
const BASE_URL = import.meta.env.VITE_API_URL;

async function apiFetch(url, options = {}) {
    // Standart options
    options.headers = options.headers || {};

    // Token-i local storage-dən götürürük
    const token = localStorage.getItem("token");
    if (token) {
        // Əgər token varsa, Authorization başlığına əlavə edirik
        options.headers["Authorization"] = `Bearer ${token}`;
    }

    // Müraciəti göndəririk
    const res = await fetch(`${BASE_URL}${url}`, options);

    // Əgər cavabın statusu 400 və ya daha yuxarıdırsa, xəta atırıq
    if (res.status >= 400) throw res;

    return res;
}

export default apiFetch;