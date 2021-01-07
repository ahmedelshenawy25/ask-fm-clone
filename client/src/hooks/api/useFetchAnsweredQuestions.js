import { useReducer, useEffect } from 'react';
import axiosInstance from '../../axiosInstance/axiosInstance';
import { initialState, questionsReducer } from '../../reducers/questionsReducer';
import { FETCH_QUESTIONS, FETCH_QUESTIONS_FAILURE, FETCH_QUESTIONS_SUCCESS } from '../../utils/types';

const useFetchAnsweredQuestions = ({ page, limit, username }) => {
  const [state, dispatch] = useReducer(questionsReducer, initialState);

  useEffect(() => {
    let cancel = false;

    const fetchAnsweredQuestions = async () => {
      dispatch({ type: FETCH_QUESTIONS });
      try {
        const response = await axiosInstance.get(`/questions/${username}/answered`, {
          params: {
            page,
            limit
          }
        });

        if (!cancel) {
          dispatch({
            type: FETCH_QUESTIONS_SUCCESS,
            questions: response.data.questions,
            questionsCount: response.data.questionsCount,
            isFollowed: response.data.isFollowed
          });
        }
      } catch (e) {
        if (!cancel) {
          dispatch({
            type: FETCH_QUESTIONS_FAILURE,
            error: e.response ? e.response.data.message : e.message
          });
        }
      }
    };

    fetchAnsweredQuestions();

    return () => {
      cancel = true;
    };
  }, [page, limit, username]);

  return state;
};

export default useFetchAnsweredQuestions;
