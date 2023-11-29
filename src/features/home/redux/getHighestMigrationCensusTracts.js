import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  HOME_GET_HIGHEST_MIGRATION_CENSUS_TRACTS_BEGIN,
  HOME_GET_HIGHEST_MIGRATION_CENSUS_TRACTS_SUCCESS,
  HOME_GET_HIGHEST_MIGRATION_CENSUS_TRACTS_FAILURE,
  HOME_GET_HIGHEST_MIGRATION_CENSUS_TRACTS_DISMISS_ERROR,
} from './constants';
import Axios from 'axios';

export function getHighestMigrationCensusTracts(args = {}) {
  return (dispatch) => { // optionally you can have getState as the second argument
    dispatch({
      type: HOME_GET_HIGHEST_MIGRATION_CENSUS_TRACTS_BEGIN,
    });

    // const mockData = [
    //   {
    //     "State": "string",
    //     "County": "string",
    //     "Migration_Level": 0,
    //     "Name": "string"
    //   },
    //   {
    //     "State": "string",
    //     "County": "string",
    //     "Migration_Level": 0,
    //     "Name": "string"
    //   }
    // ]

    Axios.defaults.baseURL = 'http://127.0.0.1:8080';
    const url = `/highestMigrationCensusTracts`;
    return Axios(url, {
      method: 'get',
      responseType: 'json',
    })
      .then(res => {
        const { data, headers } = res;
        dispatch({
          type: HOME_GET_HIGHEST_MIGRATION_CENSUS_TRACTS_SUCCESS,
          data: data,
        });
      })
      .catch(err => {
        // dispatch({
        //   type: HOME_GET_HIGHEST_MIGRATION_CENSUS_TRACTS_FAILURE,
        //   data: mockData,
        // });
        // dispatch({
        //   type: HOME_GET_HIGHEST_MIGRATION_CENSUS_TRACTS_SUCCESS,
        //   data: mockData,
        // });
        // message.error("failed to download")
      });
  };
}

export function dismissGetHighestMigrationCensusTractsError() {
  return {
    type: HOME_GET_HIGHEST_MIGRATION_CENSUS_TRACTS_DISMISS_ERROR,
  };
}

export function useGetHighestMigrationCensusTracts() {
  const dispatch = useDispatch();

  const { getHighestMigrationCensusTractsPending, getHighestMigrationCensusTractsError } = useSelector(
    state => ({
      getHighestMigrationCensusTractsPending: state.home.getHighestMigrationCensusTractsPending,
      getHighestMigrationCensusTractsError: state.home.getHighestMigrationCensusTractsError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(getHighestMigrationCensusTracts(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissGetHighestMigrationCensusTractsError());
  }, [dispatch]);

  return {
    getHighestMigrationCensusTracts: boundAction,
    getHighestMigrationCensusTractsPending,
    getHighestMigrationCensusTractsError,
    dismissGetHighestMigrationCensusTractsError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case HOME_GET_HIGHEST_MIGRATION_CENSUS_TRACTS_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        getHighestMigrationCensusTractsPending: true,
        getHighestMigrationCensusTractsError: null,
      };

    case HOME_GET_HIGHEST_MIGRATION_CENSUS_TRACTS_SUCCESS:
      // The request is success
      return {
        ...state,
        highestMigrationCensusTractsResult: action.data,
        getHighestMigrationCensusTractsPending: false,
        getHighestMigrationCensusTractsError: null,
      };

    case HOME_GET_HIGHEST_MIGRATION_CENSUS_TRACTS_FAILURE:
      // The request is failed
      return {
        ...state,
        getHighestMigrationCensusTractsPending: false,
        getHighestMigrationCensusTractsError: action.data.error,
      };

    case HOME_GET_HIGHEST_MIGRATION_CENSUS_TRACTS_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        getHighestMigrationCensusTractsError: null,
      };

    default:
      return state;
  }
}
