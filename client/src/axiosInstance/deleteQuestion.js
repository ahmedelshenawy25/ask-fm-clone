import { DELETE_QUESTION, DELETE_QUESTION_FAILURE, DELETE_QUESTION_SUCCESS } from '../utils/types';
import axiosInstance from './axiosInstance';

async function deleteQuestion({ dispatch, id }) {
  dispatch({ type: DELETE_QUESTION });
  try {
    await axiosInstance.delete(`/delete/${id}`);

    dispatch({ type: DELETE_QUESTION_SUCCESS, id });
  } catch (e) {
    dispatch({
      type: DELETE_QUESTION_FAILURE,
      error: e.response ? e.response.data.message : e.message
    });
  }
}

export default deleteQuestion;
