import TYPES from '../utils/types';
import axiosInstance from './axiosInstance';

async function fetchFriends({ dispatch, params, cancel }) {
  const { FETCH_SUCCESS, FETCH_FAILURE } = TYPES;
  try {
    const response = await axiosInstance.get('/friends', { params });

    const { users, usersCount } = response.data;
    if (!cancel.request) {
      dispatch({ type: FETCH_SUCCESS, data: users, count: usersCount });
    }
  } catch (e) {
    const error = e.response ? e.response.data.message : e.message;
    if (!cancel.request) {
      dispatch({ type: FETCH_FAILURE, error });
    }
  }
}

export default fetchFriends;
