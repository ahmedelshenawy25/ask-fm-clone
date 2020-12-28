import { useReducer, useEffect } from 'react';
import TYPES from '../utils/types';

const initialState = {
  isLoading: true,
  hasMore: true,
  data: [],
  isFollowed: true,
  error: ''
};

const reducer = (state, action) => {
  switch (action.type) {
    case TYPES.FETCH:
      return {
        ...state,
        isLoading: true,
        error: ''
      };
    case TYPES.FETCH_SUCCESS:
      return {
        ...state,
        isLoading: false,
        hasMore: state.data.length + action.data.length !== action.count,
        data: [...state.data, ...action.data],
        isFollowed: action.isFollowed
      };
    case TYPES.DELETE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        data: state.data.filter((question) => question._id !== action.id)
      };
    case TYPES.FETCH_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.error
      };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

const useFetch = ({
  apiCall, page, limit, urlParam
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    dispatch({ type: TYPES.FETCH });
    apiCall({ dispatch, params: { page, limit }, urlParam });
  }, [page]);

  return { ...state, dispatch };
};

export default useFetch;
