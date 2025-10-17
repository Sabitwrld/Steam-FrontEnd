import apiFetch from "./api";
import { REMOVE_SESSION_USER } from "./session";

export const SET_WISHLIST_ITEMS = "wishlistItems/SET_WISHLIST_ITEMS";
export const SET_OTHER_WISHLIST = "wishlistItems/SET_OTHER_WISHLIST";

const setWishlistItems = (payload, isOtherUser) => ({
    type: isOtherUser ? SET_OTHER_WISHLIST : SET_WISHLIST_ITEMS,
    payload
});

// GET /api/wishlist
export const fetchWishlistItems = () => async (dispatch) => {
    const response = await apiFetch('/api/wishlist');
    const wishlistItems = response.data.reduce((acc, item) => {
        acc[item.applicationId] = item; // Kolay erişim için applicationId'yi key yapalım
        return acc;
    }, {});
    dispatch(setWishlistItems({ wishlistItems }, false));
};

// POST /api/wishlist
export const createWishlistItem = (gameId) => async (dispatch) => {
    await apiFetch('/api/wishlist', {
        method: "POST",
        body: JSON.stringify({ applicationId: gameId })
    });
    dispatch(fetchWishlistItems()); // Listeyi yeniden çek
};

// DELETE /api/wishlist/application/{applicationId}
export const deleteWishlistItem = (applicationId) => async (dispatch) => {
    await apiFetch(`/api/wishlist/application/${applicationId}`, {
        method: 'DELETE'
    });
    dispatch(fetchWishlistItems()); // Listeyi yeniden çek
};


const initialState = { currentUser: {}, otherUser: {} };
export default function wishlistItemsReducer(state = initialState, action) {
    const newState = { ...state };
    switch (action.type) {
        case SET_WISHLIST_ITEMS:
            newState.currentUser = action.payload.wishlistItems || {};
            return newState;
        case SET_OTHER_WISHLIST:
            newState.otherUser = action.payload.wishlistItems || {};
            return newState;
        case REMOVE_SESSION_USER:
            newState.currentUser = {};
            return newState;
        default:
            return state;
    }
}