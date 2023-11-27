import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  HOME_GET_COMMUNITY_RESILENCE_SEARCH_RESULTS_BEGIN,
  HOME_GET_COMMUNITY_RESILENCE_SEARCH_RESULTS_SUCCESS,
  HOME_GET_COMMUNITY_RESILENCE_SEARCH_RESULTS_FAILURE,
  HOME_GET_COMMUNITY_RESILENCE_SEARCH_RESULTS_DISMISS_ERROR,
} from './constants';
import { message } from 'antd';
import Axios from 'axios';

export function getCommunityResilenceSearchResults(payload) {
  return dispatch => {
    // optionally you can have getState as the second argument
    dispatch({
      type: HOME_GET_COMMUNITY_RESILENCE_SEARCH_RESULTS_BEGIN,
    });

    const mockData = {
      state: 'state1',
      county: 'county1',
      fipsName: 'fipsName1',
      socialVulnerabilityScore: '10',
      communityResilienceScore: '12',
      climateRiskScore: '13',
    };

    Axios.defaults.baseURL = 'http://127.0.0.1:8080';
    const url = `/CommunityResilience`;
    return Axios(url, {
      method: 'post',
      responseType: 'json',
      data: payload,
    })
      .then(res => {
        const { data, headers } = res;
        dispatch({
          type: HOME_GET_COMMUNITY_RESILENCE_SEARCH_RESULTS_SUCCESS,
          data: data,
        });
      })
      .catch(err => {
        dispatch({
          type: HOME_GET_COMMUNITY_RESILENCE_SEARCH_RESULTS_SUCCESS,
          data: mockData,
        });
        // message.error("failed to download")
      });
  };
}

export function dismissGetCommunityResilenceSearchResultsError() {
  return {
    type: HOME_GET_COMMUNITY_RESILENCE_SEARCH_RESULTS_DISMISS_ERROR,
  };
}

export function useGetCommunityResilenceSearchResults() {
  const dispatch = useDispatch();

  const { getCommunityResilenceSearchResultsPending, getCommunityResilenceSearchResultsError } = useSelector(
    state => ({
      getCommunityResilenceSearchResultsPending: state.home.getCommunityResilenceSearchResultsPending,
      getCommunityResilenceSearchResultsError: state.home.getCommunityResilenceSearchResultsError,
    }),
    shallowEqual
  );

  const boundAction = useCallback(
    (...args) => {
      return dispatch(getCommunityResilenceSearchResults(...args));
    },
    [dispatch]
  );

  const boundDismissError = useCallback(() => {
    return dispatch(dismissGetCommunityResilenceSearchResultsError());
  }, [dispatch]);

  return {
    getCommunityResilenceSearchResults: boundAction,
    getCommunityResilenceSearchResultsPending,
    getCommunityResilenceSearchResultsError,
    dismissGetCommunityResilenceSearchResultsError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case HOME_GET_COMMUNITY_RESILENCE_SEARCH_RESULTS_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        getCommunityResilenceSearchResultsPending: true,
        getCommunityResilenceSearchResultsError: null,
      };

    case HOME_GET_COMMUNITY_RESILENCE_SEARCH_RESULTS_SUCCESS:
      // The request is success
      return {
        ...state,
        communityResilenceSearchResults: action.data,
        getCommunityResilenceSearchResultsPending: false,
        getCommunityResilenceSearchResultsError: null,
      };

    case HOME_GET_COMMUNITY_RESILENCE_SEARCH_RESULTS_FAILURE:
      // The request is failed
      return {
        ...state,
        getCommunityResilenceSearchResultsPending: false,
        getCommunityResilenceSearchResultsError: action.data.error,
      };

    case HOME_GET_COMMUNITY_RESILENCE_SEARCH_RESULTS_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        getCommunityResilenceSearchResultsError: null,
      };

    default:
      return state;
  }
}
