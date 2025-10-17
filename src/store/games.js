import apiFetch from "./api"; // 'csrfFetch' yerine 'apiFetch'
import { SET_CART_ITEMS } from "./cartItems";
import { SET_LIBRARY_ITEMS, SET_OTHER_LIBRARY } from "./libraryItems";
import { SET_OTHER_WISHLIST, SET_WISHLIST_ITEMS } from "./wishlistItems";

const SET_GAMES = "games/SET_GAMES";
const ADD_GAME = "games/ADD_GAME";
const ADD_GAMES = "games/ADD_GAMES";

export const setGames = (games) => ({ type: SET_GAMES, payload: games });
export const addGames = (games) => ({ type: ADD_GAMES, payload: games });
const addGame = (game) => ({ type: ADD_GAME, payload: game });

export const fetchGames = () => async (dispatch) => {
  try {
    const response = await apiFetch('/api/catalog'); // Endpoint güncellendi
    // Backend PagedResponse.data içindeki listeyi alıp normalleştiriyoruz
    const games = response.data.reduce((acc, game) => {
      acc[game.id] = game;
      return acc;
    }, {});
    dispatch(setGames(games));
  } catch (error) {
    console.error("Failed to fetch games:", error);
  }
};

export const fetchGame = (gameId) => async (dispatch) => {
  try {
    const game = await apiFetch(`/api/catalog/${gameId}`); // Endpoint güncellendi
    dispatch(addGame(game));
  } catch (error) {
    console.error(`Failed to fetch game ${gameId}:`, error);
  }
};

export default function gamesReducer(state = {}, action) {
  switch (action.type) {
    case SET_GAMES:
      return action.payload;
    case ADD_GAMES:
      return { ...state, ...action.payload };
    case ADD_GAME:
      return { ...state, [action.payload.id]: action.payload };
    // Diğer slice'lardan gelen oyun verilerini de state'e eklemek için
    case SET_CART_ITEMS:
    case SET_LIBRARY_ITEMS:
    case SET_OTHER_LIBRARY:
    case SET_WISHLIST_ITEMS:
    case SET_OTHER_WISHLIST:
      if (action.payload.games) {
        return { ...state, ...action.payload.games };
      }
      return state;
    default:
      return state;
  }
}