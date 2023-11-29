import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  HOME_GET_CENSUS_TRACT_FILTER_SEARCH_RESULT_BEGIN,
  HOME_GET_CENSUS_TRACT_FILTER_SEARCH_RESULT_SUCCESS,
  HOME_GET_CENSUS_TRACT_FILTER_SEARCH_RESULT_FAILURE,
  HOME_GET_CENSUS_TRACT_FILTER_SEARCH_RESULT_DISMISS_ERROR,
} from './constants';
import { message } from 'antd';
import Axios from 'axios';

export function getCensusTractFilterSearchResult(payload) {
  return (dispatch) => { // optionally you can have getState as the second argument
    dispatch({
      type: HOME_GET_CENSUS_TRACT_FILTER_SEARCH_RESULT_BEGIN,
    });


    Axios.defaults.baseURL = 'http://127.0.0.1:8080';
    const url = `/censusTractFilterSuggest`;
    return Axios(url, {
      method: 'get',
      responseType: 'json',
    })
      .then(res => {
        const { data, headers } = res;
        dispatch({
          type: HOME_GET_CENSUS_TRACT_FILTER_SEARCH_RESULT_SUCCESS,
          data: data,
        });
      })
      .catch(err => {
        // message.error("failed to download")
      });
  };
}

export function dismissGetCensusTractFilterSearchResultError() {
  return {
    type: HOME_GET_CENSUS_TRACT_FILTER_SEARCH_RESULT_DISMISS_ERROR,
  };
}

export function useGetCensusTractFilterSearchResult() {
  const dispatch = useDispatch();

  const { getCensusTractFilterSearchResultPending, getCensusTractFilterSearchResultError } = useSelector(
    state => ({
      getCensusTractFilterSearchResultPending: state.home.getCensusTractFilterSearchResultPending,
      getCensusTractFilterSearchResultError: state.home.getCensusTractFilterSearchResultError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(getCensusTractFilterSearchResult(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissGetCensusTractFilterSearchResultError());
  }, [dispatch]);

  return {
    getCensusTractFilterSearchResult: boundAction,
    getCensusTractFilterSearchResultPending,
    getCensusTractFilterSearchResultError,
    dismissGetCensusTractFilterSearchResultError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case HOME_GET_CENSUS_TRACT_FILTER_SEARCH_RESULT_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        getCensusTractFilterSearchResultPending: true,
        getCensusTractFilterSearchResultError: null,
      };

    case HOME_GET_CENSUS_TRACT_FILTER_SEARCH_RESULT_SUCCESS:
      // The request is success
      return {
        ...state,
        censusTractFilterSuggest: action.data,
        getCensusTractFilterSearchResultPending: false,
        getCensusTractFilterSearchResultError: null,
      };

    case HOME_GET_CENSUS_TRACT_FILTER_SEARCH_RESULT_FAILURE:
      // The request is failed
      return {
        ...state,
        getCensusTractFilterSearchResultPending: false,
        getCensusTractFilterSearchResultError: action.data.error,
      };

    case HOME_GET_CENSUS_TRACT_FILTER_SEARCH_RESULT_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        getCensusTractFilterSearchResultError: null,
      };

    default:
      return state;
  }
}
