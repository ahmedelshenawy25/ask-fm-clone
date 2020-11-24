import TYPES from '../utils/types';
import axiosInstance from './axiosInstance';

async function fetchFriendsQuestions({ dispatch, params }) {
  const { FETCH_SUCCESS, FETCH_FAILURE } = TYPES;
  try {
    const response = await axiosInstance.get('/home', { params });

    const { questions, questionsCount } = response.data;
    dispatch({ type: FETCH_SUCCESS, data: questions, count: questionsCount });
  } catch (e) {
    const error = e.response ? e.response.data.message : e.message;
    dispatch({ type: FETCH_FAILURE, error });
  }
}

export default fetchFriendsQuestions;
