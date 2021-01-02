import {
  DELETE_QUESTION,
  DELETE_QUESTION_FAILURE,
  DELETE_QUESTION_SUCCESS,
  FETCH_QUESTIONS,
  FETCH_QUESTIONS_FAILURE,
  FETCH_QUESTIONS_SUCCESS,
  ANSWER_QUESTION,
  ANSWER_QUESTION_SUCCESS,
  ANSWER_QUESTION_FAILURE
} from '../utils/types';

const initialState = {
  isLoading: true,
  hasMore: true,
  questions: [],
  isFollowed: true,
  error: ''
};

const questionsReducer = (state, action) => {
  switch (action.type) {
    case FETCH_QUESTIONS:
    case DELETE_QUESTION:
    case ANSWER_QUESTION:
      return {
        ...state,
        isLoading: true,
        error: ''
      };
    case FETCH_QUESTIONS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        hasMore: state.questions.length + action.questions.length !== action.questionsCount,
        questions: [...state.questions, ...action.questions],
        isFollowed: action.isFollowed
      };
    case DELETE_QUESTION_SUCCESS:
    case ANSWER_QUESTION_SUCCESS:
      return {
        ...state,
        isLoading: false,
        questions: state.questions.filter((question) => question._id !== action.id)
      };
    case FETCH_QUESTIONS_FAILURE:
    case DELETE_QUESTION_FAILURE:
    case ANSWER_QUESTION_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.error
      };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

export {
  initialState,
  questionsReducer
};
