import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  HOME_GET_AVERAGE_CLIMATE_RISK_BY_INCOME_BEGIN,
  HOME_GET_AVERAGE_CLIMATE_RISK_BY_INCOME_SUCCESS,
  HOME_GET_AVERAGE_CLIMATE_RISK_BY_INCOME_FAILURE,
  HOME_GET_AVERAGE_CLIMATE_RISK_BY_INCOME_DISMISS_ERROR,
} from './constants';
import Axios from 'axios';

export function getAverageClimateRiskByIncome(args = {}) {
  return (dispatch) => { // optionally you can have getState as the second argument
    dispatch({
      type: HOME_GET_AVERAGE_CLIMATE_RISK_BY_INCOME_BEGIN,
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
    const url = `/averageClimateRiskByIncome`;
    return Axios(url, {
      method: 'get',
      responseType: 'json',
    })
      .then(res => {
        const { data, headers } = res;
        dispatch({
          type: HOME_GET_AVERAGE_CLIMATE_RISK_BY_INCOME_SUCCESS,
          data: data,
        });
      })
      .catch(err => {
        // dispatch({
        //   type: HOME_GET_AVERAGE_CLIMATE_RISK_BY_INCOME_FAILURE,
        //   data: mockData,
        // });
        dispatch({
          type: HOME_GET_AVERAGE_CLIMATE_RISK_BY_INCOME_SUCCESS,
          data: mockData,
        });
        // message.error("failed to download")
      });
  };
}

export function dismissGetAverageClimateRiskByIncomeError() {
  return {
    type: HOME_GET_AVERAGE_CLIMATE_RISK_BY_INCOME_DISMISS_ERROR,
  };
}

export function useGetAverageClimateRiskByIncome() {
  const dispatch = useDispatch();

  const { getAverageClimateRiskByIncomePending, getAverageClimateRiskByIncomeError } = useSelector(
    state => ({
      getAverageClimateRiskByIncomePending: state.home.getAverageClimateRiskByIncomePending,
      getAverageClimateRiskByIncomeError: state.home.getAverageClimateRiskByIncomeError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(getAverageClimateRiskByIncome(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissGetAverageClimateRiskByIncomeError());
  }, [dispatch]);

  return {
    getAverageClimateRiskByIncome: boundAction,
    getAverageClimateRiskByIncomePending,
    getAverageClimateRiskByIncomeError,
    dismissGetAverageClimateRiskByIncomeError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case HOME_GET_AVERAGE_CLIMATE_RISK_BY_INCOME_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        getAverageClimateRiskByIncomePending: true,
        getAverageClimateRiskByIncomeError: null,
      };

    case HOME_GET_AVERAGE_CLIMATE_RISK_BY_INCOME_SUCCESS:
      // The request is success
      return {
        ...state,
        averageClimateRiskByIncomeResult: action.data,
        getAverageClimateRiskByIncomePending: false,
        getAverageClimateRiskByIncomeError: null,
      };

    case HOME_GET_AVERAGE_CLIMATE_RISK_BY_INCOME_FAILURE:
      // The request is failed
      return {
        ...state,
        getAverageClimateRiskByIncomePending: false,
        getAverageClimateRiskByIncomeError: action.data.error,
      };

    case HOME_GET_AVERAGE_CLIMATE_RISK_BY_INCOME_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        getAverageClimateRiskByIncomeError: null,
      };

    default:
      return state;
  }
}
