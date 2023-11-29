import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  HOME_GET_HIGHEST_RISK_CENSUS_TRACTS_BEGIN,
  HOME_GET_HIGHEST_RISK_CENSUS_TRACTS_SUCCESS,
  HOME_GET_HIGHEST_RISK_CENSUS_TRACTS_FAILURE,
  HOME_GET_HIGHEST_RISK_CENSUS_TRACTS_DISMISS_ERROR,
} from '../../../../src/features/home/redux/constants';

import {
  getHighestRiskCensusTracts,
  dismissGetHighestRiskCensusTractsError,
  reducer,
} from '../../../../src/features/home/redux/getHighestRiskCensusTracts';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('home/redux/getHighestRiskCensusTracts', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when getHighestRiskCensusTracts succeeds', () => {
    const store = mockStore({});

    return store.dispatch(getHighestRiskCensusTracts())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', HOME_GET_HIGHEST_RISK_CENSUS_TRACTS_BEGIN);
        expect(actions[1]).toHaveProperty('type', HOME_GET_HIGHEST_RISK_CENSUS_TRACTS_SUCCESS);
      });
  });

  it('dispatches failure action when getHighestRiskCensusTracts fails', () => {
    const store = mockStore({});

    return store.dispatch(getHighestRiskCensusTracts({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', HOME_GET_HIGHEST_RISK_CENSUS_TRACTS_BEGIN);
        expect(actions[1]).toHaveProperty('type', HOME_GET_HIGHEST_RISK_CENSUS_TRACTS_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissGetHighestRiskCensusTractsError', () => {
    const expectedAction = {
      type: HOME_GET_HIGHEST_RISK_CENSUS_TRACTS_DISMISS_ERROR,
    };
    expect(dismissGetHighestRiskCensusTractsError()).toEqual(expectedAction);
  });

  it('handles action type HOME_GET_HIGHEST_RISK_CENSUS_TRACTS_BEGIN correctly', () => {
    const prevState = { getHighestRiskCensusTractsPending: false };
    const state = reducer(
      prevState,
      { type: HOME_GET_HIGHEST_RISK_CENSUS_TRACTS_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.getHighestRiskCensusTractsPending).toBe(true);
  });

  it('handles action type HOME_GET_HIGHEST_RISK_CENSUS_TRACTS_SUCCESS correctly', () => {
    const prevState = { getHighestRiskCensusTractsPending: true };
    const state = reducer(
      prevState,
      { type: HOME_GET_HIGHEST_RISK_CENSUS_TRACTS_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.getHighestRiskCensusTractsPending).toBe(false);
  });

  it('handles action type HOME_GET_HIGHEST_RISK_CENSUS_TRACTS_FAILURE correctly', () => {
    const prevState = { getHighestRiskCensusTractsPending: true };
    const state = reducer(
      prevState,
      { type: HOME_GET_HIGHEST_RISK_CENSUS_TRACTS_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.getHighestRiskCensusTractsPending).toBe(false);
    expect(state.getHighestRiskCensusTractsError).toEqual(expect.anything());
  });

  it('handles action type HOME_GET_HIGHEST_RISK_CENSUS_TRACTS_DISMISS_ERROR correctly', () => {
    const prevState = { getHighestRiskCensusTractsError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: HOME_GET_HIGHEST_RISK_CENSUS_TRACTS_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.getHighestRiskCensusTractsError).toBe(null);
  });
});

