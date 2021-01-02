import { FETCH_USERS, FETCH_USERS_SUCCESS, FETCH_USERS_FAILURE } from '../utils/types';

const initialState = {
  isLoading: true,
  hasMore: true,
  users: [],
  error: ''
};

const usersReducer = (state, action) => {
  switch (action.type) {
    case FETCH_USERS:
      return {
        ...state,
        isLoading: true,
        error: ''
      };
    case FETCH_USERS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        hasMore: state.users.length + action.users.length !== action.usersCount,
        users: [...state.users, ...action.users]
      };
    case FETCH_USERS_FAILURE:
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
  usersReducer
};
