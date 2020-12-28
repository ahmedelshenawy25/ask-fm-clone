import TYPES from '../utils/types';
import axiosInstance from './axiosInstance';

async function answerQuestion({ dispatch, id, answer }) {
  const { FETCH, DELETE_SUCCESS, FETCH_FAILURE } = TYPES;
  dispatch({ type: FETCH });
  try {
    await axiosInstance.put(`/answer/${id}`, {
      answer
    });

    dispatch({ type: DELETE_SUCCESS, id });
  } catch (e) {
    const error = e.response ? e.response.data.message : e.message;
    dispatch({ type: FETCH_FAILURE, error });
  }
}

export default answerQuestion;
