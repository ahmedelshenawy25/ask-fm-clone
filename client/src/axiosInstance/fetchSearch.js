import TYPES from '../utils/types';
import axiosInstance from './axiosInstance';

async function fetchSearch({
  dispatch, params, urlParam: searchQuery, cancel
}) {
  const { FETCH_SUCCESS, FETCH_FAILURE } = TYPES;
  try {
    const response = await axiosInstance.get(`/search${searchQuery}`, { params });

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

export default fetchSearch;
