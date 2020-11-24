import TYPES from '../utils/types';
import axiosInstance from './axiosInstance';

async function fetchDiscoverUsers({ dispatch, params }) {
  const { FETCH_SUCCESS, FETCH_FAILURE } = TYPES;
  try {
    const response = await axiosInstance.get('/discover', { params });

    const { users, usersCount } = response.data;
    dispatch({ type: FETCH_SUCCESS, data: users, count: usersCount });
  } catch (e) {
    const error = e.response ? e.response.data.message : e.message;
    dispatch({ type: FETCH_FAILURE, error });
  }
}

export default fetchDiscoverUsers;