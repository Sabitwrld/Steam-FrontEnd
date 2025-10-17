import apiFetch from './api';

const SET_CURRENT_USER = "session/SET_CURRENT_USER";
const REMOVE_SESSION_USER = "session/REMOVE_SESSION_USER";

const setCurrentUser = (user) => ({ type: SET_CURRENT_USER, payload: user });
const removeSessionUser = () => ({ type: REMOVE_SESSION_USER });

const storeCurrentUser = (data) => {
    if (data && data.token) {
        localStorage.setItem("token", data.token);
        const user = { id: data.id, fullName: data.fullName, email: data.email, roles: data.roles };
        localStorage.setItem("currentUser", JSON.stringify(user));
        return user;
    } else {
        localStorage.removeItem("token");
        localStorage.removeItem("currentUser");
        return null;
    }
};

export const login = (userCredentials) => async (dispatch) => {
    const { email, password } = userCredentials;
    const response = await apiFetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, rememberMe: true })
    });
    const data = await response.json();
    const user = storeCurrentUser(data);
    dispatch(setCurrentUser(user));
};

export const signup = (userData) => async (dispatch) => {
    const { fullName, email, password } = userData;
    const response = await apiFetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, password })
    });
    const data = await response.json();
    const user = storeCurrentUser(data);
    dispatch(setCurrentUser(user));
};

export const logout = () => (dispatch) => {
    storeCurrentUser(null);
    dispatch(removeSessionUser());
};

export const restoreSession = () => (dispatch) => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (user) {
        dispatch(setCurrentUser(user));
    }
};

const initialState = { user: JSON.parse(localStorage.getItem('currentUser')) };

export default function sessionReducer(state = initialState, action) {
    switch (action.type) {
        case SET_CURRENT_USER:
            return { ...state, user: action.payload };
        case REMOVE_SESSION_USER:
            return { ...state, user: null };
        default:
            return state;
    }
}