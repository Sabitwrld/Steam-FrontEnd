import apiFetch from "./api";
// games slice'ına veri eklemek için 'addGames' eylemini import ediyoruz
import { addGames } from "./games";
import { REMOVE_SESSION_USER } from "./session";

export const SET_LIBRARY_ITEMS = "libraryItems/SET_LIBRARY_ITEMS";
export const SET_OTHER_LIBRARY = "libraryItems/SET_OTHER_LIBRARY";

const setLibraryItems = (payload, isOtherUser) => ({
  type: isOtherUser ? SET_OTHER_LIBRARY : SET_LIBRARY_ITEMS,
  payload
});

// GET /api/user-library/my-library veya /api/user-library/user/{userId}
export const fetchLibraryItems = (userId, isOtherUser = false) => async (dispatch) => {
    const url = isOtherUser ? `/api/user-library/user/${userId}` : '/api/user-library/my-library';
    const data = await apiFetch(url); // data = { id, userId, licenses: [...] }

    if (!data || !data.licenses) return; // Veri gelmezse hata oluşmasını engelle

    // 1. Adım: Gelen lisansları libraryItems state'i için normalleştir
    const libraryItems = data.licenses.reduce((acc, license) => {
        acc[license.id] = license;
        return acc;
    }, {});
    
    // 2. Adım (DÜZELTME): Lisanslardan oyun bilgilerini ayıkla ve games state'i için hazırla
    const games = data.licenses.reduce((acc, license) => {
        // Kütüphanedeki her oyunun temel bilgilerini games state'ine ekliyoruz.
        // Böylece uygulama genelinde bu oyunlara erişilebilir.
        acc[license.applicationId] = {
            id: license.applicationId,
            name: license.applicationName
            // Diğer oyun detayları (resim, açıklama vb.) oyunun kendi sayfasına girildiğinde
            // fetchGame ile çekilecektir. Bu, başlangıç yükünü hafif tutar.
        };
        return acc;
    }, {});

    // 3. Adım (YENİ): Ayıklanan oyun bilgilerini 'games' state'ine eklemek için eylemi dispatch et
    if (Object.keys(games).length > 0) {
        dispatch(addGames(games));
    }
    
    // 4. Adım: Kütüphane state'ini güncelle
    dispatch(setLibraryItems({ libraryItems }, isOtherUser));
};

const initialState = { currentUser: {}, otherUser: {} };

export default function libraryItemsReducer(state = initialState, action) {
    const newState = { ...state };
    switch (action.type) {
        case SET_LIBRARY_ITEMS:
            // payload içinden sadece libraryItems'i alıyoruz, games artık burada yönetilmiyor.
            newState.currentUser = action.payload.libraryItems || {};
            return newState;
        case SET_OTHER_LIBRARY:
            newState.otherUser = action.payload.libraryItems || {};
            return newState;
        case REMOVE_SESSION_USER:
            return initialState;
        default:
            return state;
    }
}