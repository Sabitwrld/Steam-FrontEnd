import apiFetch from './api'; // 'csrfFetch' yerine 'apiFetch'

const ADD_USER = 'users/ADD_USER';

const addUser = (user) => ({
  type: ADD_USER,
  payload: user
});

// Bu fonksiyon backend'de /api/admin/users/{userId} gibi bir endpoint'e karşılık gelmeli.
// Backend'inizde bu endpoint'i (GetUserById) AdminController içinde bulabilirsiniz.
export const fetchUser = (username) => async (dispatch) => {
  // Not: Backend'iniz username ile değil, userId ile kullanıcı getiriyor.
  // Bu, daha karmaşık bir yapı gerektirebilir (örn: önce username'den ID'yi bulmak).
  // Şimdilik, bu fonksiyonun doğrudan bir kullanıcı objesi döndürdüğünü varsayalım.
  // Gerçek uygulamada, tüm kullanıcıları çeken bir admin endpoint'i veya
  // username ile arama yapan bir endpoint daha mantıklı olabilir.
  // Simüle edilmiş bir API çağrısı:
  // const user = await apiFetch(`/api/users/by-username/${username}`);
  // dispatch(addUser(user));
  // return user; // Promise döndürmesi önemli
};

export default function usersReducer(state = {}, action) {
  switch (action.type) {
    case ADD_USER:
      const user = action.payload;
      return { ...state, [user.id]: user };
    default:
      return state;
  }
}