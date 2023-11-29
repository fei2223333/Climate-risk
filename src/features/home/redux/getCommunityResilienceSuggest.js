import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  HOME_GET_COMMUNITY_RESILIENCE_SUGGEST_BEGIN,
  HOME_GET_COMMUNITY_RESILIENCE_SUGGEST_SUCCESS,
  HOME_GET_COMMUNITY_RESILIENCE_SUGGEST_FAILURE,
  HOME_GET_COMMUNITY_RESILIENCE_SUGGEST_DISMISS_ERROR,
} from './constants';
import Axios from 'axios';

export function getCommunityResilienceSuggest(args = {}) {
  return (dispatch) => { // optionally you can have getState as the second argument
    dispatch({
      type: HOME_GET_COMMUNITY_RESILIENCE_SUGGEST_BEGIN,
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
          type: HOME_GET_COMMUNITY_RESILIENCE_SUGGEST_SUCCESS,
          data: data,
        });
      })
      .catch(err => {
        // message.error("failed to download")
      });
  };
}

export function dismissGetCommunityResilienceSuggestError() {
  return {
    type: HOME_GET_COMMUNITY_RESILIENCE_SUGGEST_DISMISS_ERROR,
  };
}

export function useGetCommunityResilienceSuggest() {
  const dispatch = useDispatch();

  const { getCommunityResilienceSuggestPending, getCommunityResilienceSuggestError } = useSelector(
    state => ({
      getCommunityResilienceSuggestPending: state.home.getCommunityResilienceSuggestPending,
      getCommunityResilienceSuggestError: state.home.getCommunityResilienceSuggestError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(getCommunityResilienceSuggest(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissGetCommunityResilienceSuggestError());
  }, [dispatch]);

  return {
    getCommunityResilienceSuggest: boundAction,
    getCommunityResilienceSuggestPending,
    getCommunityResilienceSuggestError,
    dismissGetCommunityResilienceSuggestError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case HOME_GET_COMMUNITY_RESILIENCE_SUGGEST_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        getCommunityResilienceSuggestPending: true,
        getCommunityResilienceSuggestError: null,
      };

    case HOME_GET_COMMUNITY_RESILIENCE_SUGGEST_SUCCESS:
      // The request is success
      return {
        ...state,
        communityResilenceSearchSuggest: action.data,
        getCommunityResilienceSuggestPending: false,
        getCommunityResilienceSuggestError: null,
      };

    case HOME_GET_COMMUNITY_RESILIENCE_SUGGEST_FAILURE:
      // The request is failed
      return {
        ...state,
        getCommunityResilienceSuggestPending: false,
        getCommunityResilienceSuggestError: action.data.error,
      };

    case HOME_GET_COMMUNITY_RESILIENCE_SUGGEST_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        getCommunityResilienceSuggestError: null,
      };

    default:
      return state;
  }
}
