import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  HOME_GET_AVERAGE_CLIMATE_RISK_BY_STATE_BEGIN,
  HOME_GET_AVERAGE_CLIMATE_RISK_BY_STATE_SUCCESS,
  HOME_GET_AVERAGE_CLIMATE_RISK_BY_STATE_FAILURE,
  HOME_GET_AVERAGE_CLIMATE_RISK_BY_STATE_DISMISS_ERROR,
} from '../../../../src/features/home/redux/constants';

import {
  getAverageClimateRiskByState,
  dismissGetAverageClimateRiskByStateError,
  reducer,
} from '../../../../src/features/home/redux/getAverageClimateRiskByState';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('home/redux/getAverageClimateRiskByState', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when getAverageClimateRiskByState succeeds', () => {
    const store = mockStore({});

    return store.dispatch(getAverageClimateRiskByState())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', HOME_GET_AVERAGE_CLIMATE_RISK_BY_STATE_BEGIN);
        expect(actions[1]).toHaveProperty('type', HOME_GET_AVERAGE_CLIMATE_RISK_BY_STATE_SUCCESS);
      });
  });

  it('dispatches failure action when getAverageClimateRiskByState fails', () => {
    const store = mockStore({});

    return store.dispatch(getAverageClimateRiskByState({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', HOME_GET_AVERAGE_CLIMATE_RISK_BY_STATE_BEGIN);
        expect(actions[1]).toHaveProperty('type', HOME_GET_AVERAGE_CLIMATE_RISK_BY_STATE_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissGetAverageClimateRiskByStateError', () => {
    const expectedAction = {
      type: HOME_GET_AVERAGE_CLIMATE_RISK_BY_STATE_DISMISS_ERROR,
    };
    expect(dismissGetAverageClimateRiskByStateError()).toEqual(expectedAction);
  });

  it('handles action type HOME_GET_AVERAGE_CLIMATE_RISK_BY_STATE_BEGIN correctly', () => {
    const prevState = { getAverageClimateRiskByStatePending: false };
    const state = reducer(
      prevState,
      { type: HOME_GET_AVERAGE_CLIMATE_RISK_BY_STATE_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.getAverageClimateRiskByStatePending).toBe(true);
  });

  it('handles action type HOME_GET_AVERAGE_CLIMATE_RISK_BY_STATE_SUCCESS correctly', () => {
    const prevState = { getAverageClimateRiskByStatePending: true };
    const state = reducer(
      prevState,
      { type: HOME_GET_AVERAGE_CLIMATE_RISK_BY_STATE_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.getAverageClimateRiskByStatePending).toBe(false);
  });

  it('handles action type HOME_GET_AVERAGE_CLIMATE_RISK_BY_STATE_FAILURE correctly', () => {
    const prevState = { getAverageClimateRiskByStatePending: true };
    const state = reducer(
      prevState,
      { type: HOME_GET_AVERAGE_CLIMATE_RISK_BY_STATE_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.getAverageClimateRiskByStatePending).toBe(false);
    expect(state.getAverageClimateRiskByStateError).toEqual(expect.anything());
  });

  it('handles action type HOME_GET_AVERAGE_CLIMATE_RISK_BY_STATE_DISMISS_ERROR correctly', () => {
    const prevState = { getAverageClimateRiskByStateError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: HOME_GET_AVERAGE_CLIMATE_RISK_BY_STATE_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.getAverageClimateRiskByStateError).toBe(null);
  });
});

