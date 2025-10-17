import apiFetch from "./api";
import { ADD_REVIEW, SET_REVIEWS } from "./reviews"; // Bu importlar kalabilir

const SET_VOTES = "reviewVotes/SET_VOTES";

const setVotes = (votes) => ({
  type: SET_VOTES,
  payload: votes,
});

// YENİ EYLEM: Bir değerlendirmeyi "Helpful" olarak işaretle
export const markReviewAsHelpful = (reviewId) => async (dispatch) => {
  try {
    // Backend'deki doğru endpoint'e POST isteği atıyoruz
    await apiFetch(`/api/reviews/${reviewId}/helpful`, {
      method: 'POST'
    });
    // Not: Bu işlem başarılı olduğunda backend'de sayım artar.
    // Arayüzü anında güncellemek için ya review'ı yeniden fetch etmeli
    // ya da reducer'da mevcut review'ın helpfulCount'ını bir artırmalıyız.
    // Şimdilik en basit yöntem, sayfanın yeniden render olmasını beklemek.
  } catch (error) {
    console.error(`Failed to mark review ${reviewId} as helpful:`, error);
  }
};

// YENİ EYLEM: Bir değerlendirmeyi "Funny" olarak işaretle
export const markReviewAsFunny = (reviewId) => async (dispatch) => {
  try {
    await apiFetch(`/api/reviews/${reviewId}/funny`, {
      method: 'POST'
    });
  } catch (error) {
    console.error(`Failed to mark review ${reviewId} as funny:`, error);
  }
};


// Bu reducer artık doğrudan oy verilerini tutmak yerine,
// gelecekteki geliştirmeler için bir iskelet olarak kalabilir.
// Şu anki "markAs" yapısıyla doğrudan bir state değişikliği gerekmiyor.
export default function reviewVotesReducer(state = {}, action) {
  switch (action.type) {
    case SET_VOTES:
      return action.payload;
    // Kullanıcı çıkış yaptığında oyları temizle (gerekirse)
    // case REMOVE_SESSION_USER:
    //   return {};
    default:
      return state;
  }
}