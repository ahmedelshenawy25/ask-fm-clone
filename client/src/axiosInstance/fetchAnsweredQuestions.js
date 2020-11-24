import TYPES from '../utils/types';
import axiosInstance from './axiosInstance';

async function fetchAnsweredQuestions({ dispatch, params, urlParam: username }) {
  const { FETCH_SUCCESS, FETCH_FAILURE } = TYPES;
  try {
    const response = await axiosInstance.get(`/user/${username}`, { params });

    const { questions, questionsCount, isFollowed } = response.data;
    dispatch({
      type: FETCH_SUCCESS,
      data: questions,
      count: questionsCount,
      isFollowed
    });
  } catch (e) {
    const error = e.response ? e.response.data.message : e.message;
    dispatch({ type: FETCH_FAILURE, error });
  }
}

export default fetchAnsweredQuestions;
