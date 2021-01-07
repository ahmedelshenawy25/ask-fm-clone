import { ANSWER_QUESTION, ANSWER_QUESTION_FAILURE, ANSWER_QUESTION_SUCCESS } from '../utils/types';
import axiosInstance from './axiosInstance';

async function answerQuestion({ dispatch, id, answer }) {
  dispatch({ type: ANSWER_QUESTION });
  try {
    await axiosInstance.put(`/questions/${id}`, {
      answer
    });

    dispatch({
      type: ANSWER_QUESTION_SUCCESS,
      id
    });
  } catch (e) {
    dispatch({
      type: ANSWER_QUESTION_FAILURE,
      error: e.response ? e.response.data.message : e.message
    });
  }
}

export default answerQuestion;
