import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  HOME_GET_LOWEST_RISK_CENSUS_TRACTS_BEGIN,
  HOME_GET_LOWEST_RISK_CENSUS_TRACTS_SUCCESS,
  HOME_GET_LOWEST_RISK_CENSUS_TRACTS_FAILURE,
  HOME_GET_LOWEST_RISK_CENSUS_TRACTS_DISMISS_ERROR,
} from '../../../../src/features/home/redux/constants';

import {
  getLowestRiskCensusTracts,
  dismissGetLowestRiskCensusTractsError,
  reducer,
} from '../../../../src/features/home/redux/getLowestRiskCensusTracts';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('home/redux/getLowestRiskCensusTracts', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when getLowestRiskCensusTracts succeeds', () => {
    const store = mockStore({});

    return store.dispatch(getLowestRiskCensusTracts())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', HOME_GET_LOWEST_RISK_CENSUS_TRACTS_BEGIN);
        expect(actions[1]).toHaveProperty('type', HOME_GET_LOWEST_RISK_CENSUS_TRACTS_SUCCESS);
      });
  });

  it('dispatches failure action when getLowestRiskCensusTracts fails', () => {
    const store = mockStore({});

    return store.dispatch(getLowestRiskCensusTracts({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', HOME_GET_LOWEST_RISK_CENSUS_TRACTS_BEGIN);
        expect(actions[1]).toHaveProperty('type', HOME_GET_LOWEST_RISK_CENSUS_TRACTS_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissGetLowestRiskCensusTractsError', () => {
    const expectedAction = {
      type: HOME_GET_LOWEST_RISK_CENSUS_TRACTS_DISMISS_ERROR,
    };
    expect(dismissGetLowestRiskCensusTractsError()).toEqual(expectedAction);
  });

  it('handles action type HOME_GET_LOWEST_RISK_CENSUS_TRACTS_BEGIN correctly', () => {
    const prevState = { getLowestRiskCensusTractsPending: false };
    const state = reducer(
      prevState,
      { type: HOME_GET_LOWEST_RISK_CENSUS_TRACTS_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.getLowestRiskCensusTractsPending).toBe(true);
  });

  it('handles action type HOME_GET_LOWEST_RISK_CENSUS_TRACTS_SUCCESS correctly', () => {
    const prevState = { getLowestRiskCensusTractsPending: true };
    const state = reducer(
      prevState,
      { type: HOME_GET_LOWEST_RISK_CENSUS_TRACTS_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.getLowestRiskCensusTractsPending).toBe(false);
  });

  it('handles action type HOME_GET_LOWEST_RISK_CENSUS_TRACTS_FAILURE correctly', () => {
    const prevState = { getLowestRiskCensusTractsPending: true };
    const state = reducer(
      prevState,
      { type: HOME_GET_LOWEST_RISK_CENSUS_TRACTS_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.getLowestRiskCensusTractsPending).toBe(false);
    expect(state.getLowestRiskCensusTractsError).toEqual(expect.anything());
  });

  it('handles action type HOME_GET_LOWEST_RISK_CENSUS_TRACTS_DISMISS_ERROR correctly', () => {
    const prevState = { getLowestRiskCensusTractsError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: HOME_GET_LOWEST_RISK_CENSUS_TRACTS_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.getLowestRiskCensusTractsError).toBe(null);
  });
});

