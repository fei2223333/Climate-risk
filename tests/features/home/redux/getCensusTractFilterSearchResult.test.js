import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  HOME_GET_CENSUS_TRACT_FILTER_SEARCH_RESULT_BEGIN,
  HOME_GET_CENSUS_TRACT_FILTER_SEARCH_RESULT_SUCCESS,
  HOME_GET_CENSUS_TRACT_FILTER_SEARCH_RESULT_FAILURE,
  HOME_GET_CENSUS_TRACT_FILTER_SEARCH_RESULT_DISMISS_ERROR,
} from '../../../../src/features/home/redux/constants';

import {
  getCensusTractFilterSearchResult,
  dismissGetCensusTractFilterSearchResultError,
  reducer,
} from '../../../../src/features/home/redux/getCensusTractFilterSearchResult';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('home/redux/getCensusTractFilterSearchResult', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when getCensusTractFilterSearchResult succeeds', () => {
    const store = mockStore({});

    return store.dispatch(getCensusTractFilterSearchResult())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', HOME_GET_CENSUS_TRACT_FILTER_SEARCH_RESULT_BEGIN);
        expect(actions[1]).toHaveProperty('type', HOME_GET_CENSUS_TRACT_FILTER_SEARCH_RESULT_SUCCESS);
      });
  });

  it('dispatches failure action when getCensusTractFilterSearchResult fails', () => {
    const store = mockStore({});

    return store.dispatch(getCensusTractFilterSearchResult({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', HOME_GET_CENSUS_TRACT_FILTER_SEARCH_RESULT_BEGIN);
        expect(actions[1]).toHaveProperty('type', HOME_GET_CENSUS_TRACT_FILTER_SEARCH_RESULT_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissGetCensusTractFilterSearchResultError', () => {
    const expectedAction = {
      type: HOME_GET_CENSUS_TRACT_FILTER_SEARCH_RESULT_DISMISS_ERROR,
    };
    expect(dismissGetCensusTractFilterSearchResultError()).toEqual(expectedAction);
  });

  it('handles action type HOME_GET_CENSUS_TRACT_FILTER_SEARCH_RESULT_BEGIN correctly', () => {
    const prevState = { getCensusTractFilterSearchResultPending: false };
    const state = reducer(
      prevState,
      { type: HOME_GET_CENSUS_TRACT_FILTER_SEARCH_RESULT_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.getCensusTractFilterSearchResultPending).toBe(true);
  });

  it('handles action type HOME_GET_CENSUS_TRACT_FILTER_SEARCH_RESULT_SUCCESS correctly', () => {
    const prevState = { getCensusTractFilterSearchResultPending: true };
    const state = reducer(
      prevState,
      { type: HOME_GET_CENSUS_TRACT_FILTER_SEARCH_RESULT_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.getCensusTractFilterSearchResultPending).toBe(false);
  });

  it('handles action type HOME_GET_CENSUS_TRACT_FILTER_SEARCH_RESULT_FAILURE correctly', () => {
    const prevState = { getCensusTractFilterSearchResultPending: true };
    const state = reducer(
      prevState,
      { type: HOME_GET_CENSUS_TRACT_FILTER_SEARCH_RESULT_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.getCensusTractFilterSearchResultPending).toBe(false);
    expect(state.getCensusTractFilterSearchResultError).toEqual(expect.anything());
  });

  it('handles action type HOME_GET_CENSUS_TRACT_FILTER_SEARCH_RESULT_DISMISS_ERROR correctly', () => {
    const prevState = { getCensusTractFilterSearchResultError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: HOME_GET_CENSUS_TRACT_FILTER_SEARCH_RESULT_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.getCensusTractFilterSearchResultError).toBe(null);
  });
});

