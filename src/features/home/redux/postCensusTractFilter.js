import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  HOME_POST_CENSUS_TRACT_FILTER_BEGIN,
  HOME_POST_CENSUS_TRACT_FILTER_SUCCESS,
  HOME_POST_CENSUS_TRACT_FILTER_FAILURE,
  HOME_POST_CENSUS_TRACT_FILTER_DISMISS_ERROR,
} from './constants';
import Axios from 'axios';

export function postCensusTractFilter(payload) {
  return (dispatch) => { // optionally you can have getState as the second argument
    dispatch({
      type: HOME_POST_CENSUS_TRACT_FILTER_BEGIN,
    });

    const mockData = {
      state: 'state1',
      county: 'county1',
      Census_Tract: 'Census_Tract',
      Population: 0,
      Climate_Risk_Score: 0,
      Social_Vulnerability_Score: 0,
      Community_Resilience_Score: 0,
      Median_Individual_Income: 0,
      Sex_Ratio: [
        {
          sex: "female",
          ratio: 0.5
        },
        {
          sex: "make",
          ratio: 0.5
        }
      ],
      Age: [
        {
          age: "10",
          ratio: 0.5
        },
        {
          age: "20",
          ratio: 0.3
        },
        {
          age: "30",
          ratio: 0.2
        }
      ],
      Education: [
        {
          type: "Hight School",
          ratio: 0.1
        },
        {
          type: "College",
          ratio: 0.9
        }
      ],
      Income: [
        {
          type: "1000-2000",
          ratio: 0.2
        },
        {
          type: "2000-4000",
          ratio: 0.3
        },
        {
          type: "2000-6000",
          ratio: 0.5
        }
      ]
    };

    Axios.defaults.baseURL = 'http://127.0.0.1:8080';
    const url = `/censusTractFilter`;
    return Axios(url, {
      method: 'post',
      responseType: 'json',
      data: payload,
    })
      .then(res => {
        const { data, headers } = res;
        dispatch({
          type: HOME_POST_CENSUS_TRACT_FILTER_SUCCESS,
          data: data,
        });
      })
      .catch(err => {
        dispatch({
          type: HOME_POST_CENSUS_TRACT_FILTER_FAILURE,
          data: mockData,
        });
        // message.error("failed to download")
      });
  };
}

export function dismissPostCensusTractFilterError() {
  return {
    type: HOME_POST_CENSUS_TRACT_FILTER_DISMISS_ERROR,
  };
}

export function usePostCensusTractFilter() {
  const dispatch = useDispatch();

  const { postCensusTractFilterPending, postCensusTractFilterError } = useSelector(
    state => ({
      postCensusTractFilterPending: state.home.postCensusTractFilterPending,
      postCensusTractFilterError: state.home.postCensusTractFilterError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(postCensusTractFilter(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissPostCensusTractFilterError());
  }, [dispatch]);

  return {
    postCensusTractFilter: boundAction,
    postCensusTractFilterPending,
    postCensusTractFilterError,
    dismissPostCensusTractFilterError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case HOME_POST_CENSUS_TRACT_FILTER_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        postCensusTractFilterPending: true,
        postCensusTractFilterError: null,
      };

    case HOME_POST_CENSUS_TRACT_FILTER_SUCCESS:
      // The request is success
      return {
        ...state,
        censusTractFilterResult: action.data,
        postCensusTractFilterPending: false,
        postCensusTractFilterError: null,
      };

    case HOME_POST_CENSUS_TRACT_FILTER_FAILURE:
      // The request is failed
      return {
        ...state,
        censusTractFilterResult: action.data,
        postCensusTractFilterPending: false,
        postCensusTractFilterError: action.data.error,
      };

    case HOME_POST_CENSUS_TRACT_FILTER_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        postCensusTractFilterError: null,
      };

    default:
      return state;
  }
}
