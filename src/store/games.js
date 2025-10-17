import apiFetch from "./api";
import { SET_CART_ITEMS } from "./cartItems";
import { SET_LIBRARY_ITEMS, SET_OTHER_LIBRARY } from "./libraryItems";
import { SET_OTHER_WISHLIST, SET_WISHLIST_ITEMS } from "./wishlistItems";

const SET_GAMES = "games/SET_GAMES";
const ADD_GAME = "games/ADD_GAME";

export const setGames = (games) => ({ type: SET_GAMES, payload: games });
const addGame = (game) => ({ type: ADD_GAME, payload: game });

// Endpoint /api/catalog olarak güncellendi
export const fetchGames = () => async (dispatch) => {
  const response = await apiFetch('/api/catalog');
  // Backend'den gelen PagedResponse'dan 'data' alanını alıyoruz
  const games = response.data.reduce((acc, game) => {
    acc[game.id] = game;
    return acc;
  }, {});
  dispatch(setGames(games));
};

// Endpoint /api/catalog/{id} olarak güncellendi
export const fetchGame = (gameId) => async (dispatch) => {
  const game = await apiFetch(`/api/catalog/${gameId}`);
  dispatch(addGame(game));
};

// Reducer'da ADD_GAME mantığı düzeltildi
export default function gamesReducer(state = {}, action) {
  switch (action.type) {
    case SET_GAMES:
      return action.payload;
    case ADD_GAME:
      return { ...state, [action.payload.id]: action.payload };
    // Diğer case'ler ilişkili verileri (oyunları) state'e eklemek için
    case SET_CART_ITEMS:
    case SET_LIBRARY_ITEMS:
    case SET_OTHER_LIBRARY:
    case SET_WISHLIST_ITEMS:
    case SET_OTHER_WISHLIST:
        // Eğer payload'da oyun verisi varsa ekle
        if (action.payload.games) {
            return { ...state, ...action.payload.games };
        }
        return state;
    default:
      return state;
  }
}