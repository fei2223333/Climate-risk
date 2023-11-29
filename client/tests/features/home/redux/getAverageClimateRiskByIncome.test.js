import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  HOME_GET_AVERAGE_CLIMATE_RISK_BY_INCOME_BEGIN,
  HOME_GET_AVERAGE_CLIMATE_RISK_BY_INCOME_SUCCESS,
  HOME_GET_AVERAGE_CLIMATE_RISK_BY_INCOME_FAILURE,
  HOME_GET_AVERAGE_CLIMATE_RISK_BY_INCOME_DISMISS_ERROR,
} from '../../../../src/features/home/redux/constants';

import {
  getAverageClimateRiskByIncome,
  dismissGetAverageClimateRiskByIncomeError,
  reducer,
} from '../../../../src/features/home/redux/getAverageClimateRiskByIncome';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('home/redux/getAverageClimateRiskByIncome', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when getAverageClimateRiskByIncome succeeds', () => {
    const store = mockStore({});

    return store.dispatch(getAverageClimateRiskByIncome())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', HOME_GET_AVERAGE_CLIMATE_RISK_BY_INCOME_BEGIN);
        expect(actions[1]).toHaveProperty('type', HOME_GET_AVERAGE_CLIMATE_RISK_BY_INCOME_SUCCESS);
      });
  });

  it('dispatches failure action when getAverageClimateRiskByIncome fails', () => {
    const store = mockStore({});

    return store.dispatch(getAverageClimateRiskByIncome({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', HOME_GET_AVERAGE_CLIMATE_RISK_BY_INCOME_BEGIN);
        expect(actions[1]).toHaveProperty('type', HOME_GET_AVERAGE_CLIMATE_RISK_BY_INCOME_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissGetAverageClimateRiskByIncomeError', () => {
    const expectedAction = {
      type: HOME_GET_AVERAGE_CLIMATE_RISK_BY_INCOME_DISMISS_ERROR,
    };
    expect(dismissGetAverageClimateRiskByIncomeError()).toEqual(expectedAction);
  });

  it('handles action type HOME_GET_AVERAGE_CLIMATE_RISK_BY_INCOME_BEGIN correctly', () => {
    const prevState = { getAverageClimateRiskByIncomePending: false };
    const state = reducer(
      prevState,
      { type: HOME_GET_AVERAGE_CLIMATE_RISK_BY_INCOME_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.getAverageClimateRiskByIncomePending).toBe(true);
  });

  it('handles action type HOME_GET_AVERAGE_CLIMATE_RISK_BY_INCOME_SUCCESS correctly', () => {
    const prevState = { getAverageClimateRiskByIncomePending: true };
    const state = reducer(
      prevState,
      { type: HOME_GET_AVERAGE_CLIMATE_RISK_BY_INCOME_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.getAverageClimateRiskByIncomePending).toBe(false);
  });

  it('handles action type HOME_GET_AVERAGE_CLIMATE_RISK_BY_INCOME_FAILURE correctly', () => {
    const prevState = { getAverageClimateRiskByIncomePending: true };
    const state = reducer(
      prevState,
      { type: HOME_GET_AVERAGE_CLIMATE_RISK_BY_INCOME_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.getAverageClimateRiskByIncomePending).toBe(false);
    expect(state.getAverageClimateRiskByIncomeError).toEqual(expect.anything());
  });

  it('handles action type HOME_GET_AVERAGE_CLIMATE_RISK_BY_INCOME_DISMISS_ERROR correctly', () => {
    const prevState = { getAverageClimateRiskByIncomeError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: HOME_GET_AVERAGE_CLIMATE_RISK_BY_INCOME_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.getAverageClimateRiskByIncomeError).toBe(null);
  });
});

