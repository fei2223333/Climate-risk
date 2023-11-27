import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  HOME_GET_LOWEST_MIGRATION_CENSUS_TRACTS_BEGIN,
  HOME_GET_LOWEST_MIGRATION_CENSUS_TRACTS_SUCCESS,
  HOME_GET_LOWEST_MIGRATION_CENSUS_TRACTS_FAILURE,
  HOME_GET_LOWEST_MIGRATION_CENSUS_TRACTS_DISMISS_ERROR,
} from './constants';
import Axios from 'axios';

export function getLowestMigrationCensusTracts(args = {}) {
  return (dispatch) => { // optionally you can have getState as the second argument
    dispatch({
      type: HOME_GET_LOWEST_MIGRATION_CENSUS_TRACTS_BEGIN,
    });

    const mockData = [
      {
        "State": "string",
        "County": "string",
        "Migration_Level": 0,
        "Name": "string"
      },
      {
        "State": "string",
        "County": "string",
        "Migration_Level": 0,
        "Name": "string"
      }
    ]

    Axios.defaults.baseURL = 'http://127.0.0.1:8080';
    const url = `/lowestMigrationCensusTracts`;
    return Axios(url, {
      method: 'get',
      responseType: 'json',
    })
      .then(res => {
        const { data, headers } = res;
        dispatch({
          type: HOME_GET_LOWEST_MIGRATION_CENSUS_TRACTS_SUCCESS,
          data: data,
        });
      })
      .catch(err => {
        // dispatch({
        //   type: HOME_GET_LOWEST_MIGRATION_CENSUS_TRACTS_FAILURE,
        //   data: mockData,
        // });
        dispatch({
          type: HOME_GET_LOWEST_MIGRATION_CENSUS_TRACTS_SUCCESS,
          data: mockData,
        });
        // message.error("failed to download")
      });
  };
}

export function dismissGetLowestMigrationCensusTractsError() {
  return {
    type: HOME_GET_LOWEST_MIGRATION_CENSUS_TRACTS_DISMISS_ERROR,
  };
}

export function useGetLowestMigrationCensusTracts() {
  const dispatch = useDispatch();

  const { getLowestMigrationCensusTractsPending, getLowestMigrationCensusTractsError } = useSelector(
    state => ({
      getLowestMigrationCensusTractsPending: state.home.getLowestMigrationCensusTractsPending,
      getLowestMigrationCensusTractsError: state.home.getLowestMigrationCensusTractsError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(getLowestMigrationCensusTracts(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissGetLowestMigrationCensusTractsError());
  }, [dispatch]);

  return {
    getLowestMigrationCensusTracts: boundAction,
    getLowestMigrationCensusTractsPending,
    getLowestMigrationCensusTractsError,
    dismissGetLowestMigrationCensusTractsError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case HOME_GET_LOWEST_MIGRATION_CENSUS_TRACTS_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        getLowestMigrationCensusTractsPending: true,
        getLowestMigrationCensusTractsError: null,
      };

    case HOME_GET_LOWEST_MIGRATION_CENSUS_TRACTS_SUCCESS:
      // The request is success
      return {
        ...state,
        lowestMigrationCensusTractsResult: action.data,
        getLowestMigrationCensusTractsPending: false,
        getLowestMigrationCensusTractsError: null,
      };

    case HOME_GET_LOWEST_MIGRATION_CENSUS_TRACTS_FAILURE:
      // The request is failed
      return {
        ...state,
        getLowestMigrationCensusTractsPending: false,
        getLowestMigrationCensusTractsError: action.data.error,
      };

    case HOME_GET_LOWEST_MIGRATION_CENSUS_TRACTS_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        getLowestMigrationCensusTractsError: null,
      };

    default:
      return state;
  }
}
