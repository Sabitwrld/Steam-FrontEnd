import apiFetch from "./api"; // 'csrfFetch' yerine 'apiFetch' import edildi

export const SET_REVIEWS = "reviews/SET_REVIEWS";
const ADD_REVIEW = "reviews/ADD_REVIEW";

export const setReviews = (reviews) => ({
  type: SET_REVIEWS,
  payload: reviews,
});

const addReview = (review) => ({
  type: ADD_REVIEW,
  payload: review,
});

// GET /api/reviews/application/{applicationId}
export const fetchReviews = (applicationId) => async (dispatch) => {
  if (!applicationId) return;
  try {
    const response = await apiFetch(`/api/reviews/application/${applicationId}`);
    // Backend'den gelen PagedResponse'dan 'data' alanını alıyoruz
    const reviews = response.data.reduce((acc, review) => {
      acc[review.id] = review;
      return acc;
    }, {});
    dispatch(setReviews(reviews));
  } catch (error) {
    console.error("Failed to fetch reviews:", error);
  }
};

// POST /api/reviews
export const createReview = (reviewData) => async (dispatch) => {
  const newReview = await apiFetch('/api/reviews', {
    method: 'POST',
    body: JSON.stringify(reviewData)
  });
  dispatch(addReview(newReview));
  return newReview;
};

// PUT /api/reviews/{id}
export const updateReview = (reviewId, reviewData) => async (dispatch) => {
    const updatedReview = await apiFetch(`/api/reviews/${reviewId}`, {
        method: 'PUT',
        body: JSON.stringify(reviewData)
    });
    dispatch(addReview(updatedReview)); // Add/update in the store
    return updatedReview;
};

// DELETE /api/reviews/{id}
export const deleteReview = (reviewId) => async () => {
    await apiFetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE'
    });
    // Reducer bu eylemi yakalayıp state'den silecek
};


export default function reviewsReducer(state = {}, action) {
  const newState = { ...state };
  switch (action.type) {
    case SET_REVIEWS:
      return action.payload;
    case ADD_REVIEW:
      newState[action.payload.id] = action.payload;
      return newState;
    default:
      return state;
  }
}