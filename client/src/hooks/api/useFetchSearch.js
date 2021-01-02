import { useReducer, useEffect } from 'react';
import axiosInstance from '../../axiosInstance/axiosInstance';
import { initialState, usersReducer } from '../../reducers/usersReducer';
import { FETCH_USERS, FETCH_USERS_FAILURE, FETCH_USERS_SUCCESS } from '../../utils/types';

const useFetchSearch = ({ page, limit, searchQuery }) => {
  const [state, dispatch] = useReducer(usersReducer, initialState);

  useEffect(() => {
    let cancel = false;

    const fetchSearch = async () => {
      dispatch({ type: FETCH_USERS });
      try {
        const response = await axiosInstance.get(`/search${searchQuery}`, {
          params: {
            page,
            limit
          }
        });

        if (!cancel) {
          dispatch({
            type: FETCH_USERS_SUCCESS,
            users: response.data.users,
            usersCount: response.data.usersCount
          });
        }
      } catch (e) {
        if (!cancel) {
          dispatch({
            type: FETCH_USERS_FAILURE,
            error: e.response ? e.response.data.message : e.message
          });
        }
      }
    };

    fetchSearch();

    return () => {
      cancel = true;
    };
  }, [page, limit]);

  return state;
};

export default useFetchSearch;
