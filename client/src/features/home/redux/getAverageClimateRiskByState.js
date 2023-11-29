import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  HOME_GET_AVERAGE_CLIMATE_RISK_BY_STATE_BEGIN,
  HOME_GET_AVERAGE_CLIMATE_RISK_BY_STATE_SUCCESS,
  HOME_GET_AVERAGE_CLIMATE_RISK_BY_STATE_FAILURE,
  HOME_GET_AVERAGE_CLIMATE_RISK_BY_STATE_DISMISS_ERROR,
} from './constants';
import Axios from 'axios';

export function getAverageClimateRiskByState(args = {}) {
  return (dispatch) => { // optionally you can have getState as the second argument
    dispatch({
      type: HOME_GET_AVERAGE_CLIMATE_RISK_BY_STATE_BEGIN,
    });

    const mockData = [
      {
        "State": "string",
        "Population": "string",
        "Average_Climate_Risk_Score": 0
      },
      {
        "State": "string",
        "Population": "string",
        "Average_Climate_Risk_Score": 0
      }
    ]

    Axios.defaults.baseURL = 'http://127.0.0.1:8080';
    const url = `/averageClimateRiskByState`;
    return Axios(url, {
      method: 'get',
      responseType: 'json',
    })
      .then(res => {
        const { data, headers } = res;
        dispatch({
          type: HOME_GET_AVERAGE_CLIMATE_RISK_BY_STATE_SUCCESS,
          data: data,
        });
      })
      .catch(err => {
        // dispatch({
        //   type: HOME_GET_AVERAGE_CLIMATE_RISK_BY_STATE_FAILURE,
        //   data: mockData,
        // });
        dispatch({
          type: HOME_GET_AVERAGE_CLIMATE_RISK_BY_STATE_SUCCESS,
          data: mockData,
        });
        // message.error("failed to download")
      });
  };
}

export function dismissGetAverageClimateRiskByStateError() {
  return {
    type: HOME_GET_AVERAGE_CLIMATE_RISK_BY_STATE_DISMISS_ERROR,
  };
}

export function useGetAverageClimateRiskByState() {
  const dispatch = useDispatch();

  const { getAverageClimateRiskByStatePending, getAverageClimateRiskByStateError } = useSelector(
    state => ({
      getAverageClimateRiskByStatePending: state.home.getAverageClimateRiskByStatePending,
      getAverageClimateRiskByStateError: state.home.getAverageClimateRiskByStateError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(getAverageClimateRiskByState(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissGetAverageClimateRiskByStateError());
  }, [dispatch]);

  return {
    getAverageClimateRiskByState: boundAction,
    getAverageClimateRiskByStatePending,
    getAverageClimateRiskByStateError,
    dismissGetAverageClimateRiskByStateError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case HOME_GET_AVERAGE_CLIMATE_RISK_BY_STATE_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        getAverageClimateRiskByStatePending: true,
        getAverageClimateRiskByStateError: null,
      };

    case HOME_GET_AVERAGE_CLIMATE_RISK_BY_STATE_SUCCESS:
      // The request is success
      return {
        ...state,
        averageClimateRiskByStateResult: action.data,
        getAverageClimateRiskByStatePending: false,
        getAverageClimateRiskByStateError: null,
      };

    case HOME_GET_AVERAGE_CLIMATE_RISK_BY_STATE_FAILURE:
      // The request is failed
      return {
        ...state,
        getAverageClimateRiskByStatePending: false,
        getAverageClimateRiskByStateError: action.data.error,
      };

    case HOME_GET_AVERAGE_CLIMATE_RISK_BY_STATE_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        getAverageClimateRiskByStateError: null,
      };

    default:
      return state;
  }
}
