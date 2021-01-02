import { useReducer, useEffect } from 'react';
import axiosInstance from '../../axiosInstance/axiosInstance';
import { initialState, questionsReducer } from '../../reducers/questionsReducer';
import { FETCH_QUESTIONS, FETCH_QUESTIONS_FAILURE, FETCH_QUESTIONS_SUCCESS } from '../../utils/types';

const useFetchFriendsQuestions = ({ page, limit }) => {
  const [state, dispatch] = useReducer(questionsReducer, initialState);

  useEffect(() => {
    let cancel = false;

    const fetchFriendsQuestions = async () => {
      dispatch({ type: FETCH_QUESTIONS });
      try {
        const response = await axiosInstance.get('/home', {
          params: {
            page,
            limit
          }
        });

        if (!cancel) {
          dispatch({
            type: FETCH_QUESTIONS_SUCCESS,
            questions: response.data.questions,
            questionsCount: response.data.questionsCount
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

    fetchFriendsQuestions();

    return () => {
      cancel = true;
    };
  }, [page, limit]);

  return state;
};

export default useFetchFriendsQuestions;
