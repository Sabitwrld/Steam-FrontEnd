import apiFetch from './api';
import { REMOVE_SESSION_USER } from "./session";

export const SET_CART_ITEMS = "cartItems/SET_CART_ITEMS";
const CLEAR_CART = "cartItems/CLEAR_CART";

const setCartItems = (payload) => ({ type: SET_CART_ITEMS, payload });
export const clearCart = () => ({ type: CLEAR_CART });

// GET /api/cart
export const fetchCartItems = () => async (dispatch) => {
  const data = await apiFetch('/api/cart');
  // Gelen veriyi normalleştir (ID'leri key yap)
  const cartItems = data.items.reduce((acc, item) => {
      acc[item.id] = item;
      return acc;
  }, {});
  dispatch(setCartItems({ cartItems }));
};

// POST /api/cart/items
export const createCartItem = (gameId) => async (dispatch) => {
  await apiFetch('/api/cart/items', {
    method: "POST",
    body: JSON.stringify({ applicationId: gameId }) // Backend 'applicationId' bekliyor
  });
  dispatch(fetchCartItems()); // Sepeti yeniden çekerek güncel durumu al
};

// DELETE /api/cart/items/{cartItemId}
export const deleteCartItem = (cartItemId) => async (dispatch) => {
  await apiFetch(`/api/cart/items/${cartItemId}`, {
    method: 'DELETE'
  });
  dispatch(fetchCartItems()); // Sepeti yeniden çek
};

// DELETE /api/cart
export const deleteAllCartItems = () => async (dispatch) => {
  await apiFetch('/api/cart', {
    method: 'DELETE'
  });
  dispatch(clearCart());
};

export default function cartItemsReducer(state = {}, action) {
  switch (action.type) {
    case SET_CART_ITEMS:
      return action.payload.cartItems || {};
    case CLEAR_CART:
      return {};
    case REMOVE_SESSION_USER: // Kullanıcı çıkış yaptığında sepeti temizle
      return {};
    default:
      return state;
  }
}