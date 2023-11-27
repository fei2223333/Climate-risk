import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  HOME_GET_HIGHEST_MIGRATION_CENSUS_TRACTS_BEGIN,
  HOME_GET_HIGHEST_MIGRATION_CENSUS_TRACTS_SUCCESS,
  HOME_GET_HIGHEST_MIGRATION_CENSUS_TRACTS_FAILURE,
  HOME_GET_HIGHEST_MIGRATION_CENSUS_TRACTS_DISMISS_ERROR,
} from '../../../../src/features/home/redux/constants';

import {
  getHighestMigrationCensusTracts,
  dismissGetHighestMigrationCensusTractsError,
  reducer,
} from '../../../../src/features/home/redux/getHighestMigrationCensusTracts';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('home/redux/getHighestMigrationCensusTracts', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when getHighestMigrationCensusTracts succeeds', () => {
    const store = mockStore({});

    return store.dispatch(getHighestMigrationCensusTracts())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', HOME_GET_HIGHEST_MIGRATION_CENSUS_TRACTS_BEGIN);
        expect(actions[1]).toHaveProperty('type', HOME_GET_HIGHEST_MIGRATION_CENSUS_TRACTS_SUCCESS);
      });
  });

  it('dispatches failure action when getHighestMigrationCensusTracts fails', () => {
    const store = mockStore({});

    return store.dispatch(getHighestMigrationCensusTracts({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', HOME_GET_HIGHEST_MIGRATION_CENSUS_TRACTS_BEGIN);
        expect(actions[1]).toHaveProperty('type', HOME_GET_HIGHEST_MIGRATION_CENSUS_TRACTS_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissGetHighestMigrationCensusTractsError', () => {
    const expectedAction = {
      type: HOME_GET_HIGHEST_MIGRATION_CENSUS_TRACTS_DISMISS_ERROR,
    };
    expect(dismissGetHighestMigrationCensusTractsError()).toEqual(expectedAction);
  });

  it('handles action type HOME_GET_HIGHEST_MIGRATION_CENSUS_TRACTS_BEGIN correctly', () => {
    const prevState = { getHighestMigrationCensusTractsPending: false };
    const state = reducer(
      prevState,
      { type: HOME_GET_HIGHEST_MIGRATION_CENSUS_TRACTS_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.getHighestMigrationCensusTractsPending).toBe(true);
  });

  it('handles action type HOME_GET_HIGHEST_MIGRATION_CENSUS_TRACTS_SUCCESS correctly', () => {
    const prevState = { getHighestMigrationCensusTractsPending: true };
    const state = reducer(
      prevState,
      { type: HOME_GET_HIGHEST_MIGRATION_CENSUS_TRACTS_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.getHighestMigrationCensusTractsPending).toBe(false);
  });

  it('handles action type HOME_GET_HIGHEST_MIGRATION_CENSUS_TRACTS_FAILURE correctly', () => {
    const prevState = { getHighestMigrationCensusTractsPending: true };
    const state = reducer(
      prevState,
      { type: HOME_GET_HIGHEST_MIGRATION_CENSUS_TRACTS_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.getHighestMigrationCensusTractsPending).toBe(false);
    expect(state.getHighestMigrationCensusTractsError).toEqual(expect.anything());
  });

  it('handles action type HOME_GET_HIGHEST_MIGRATION_CENSUS_TRACTS_DISMISS_ERROR correctly', () => {
    const prevState = { getHighestMigrationCensusTractsError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: HOME_GET_HIGHEST_MIGRATION_CENSUS_TRACTS_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.getHighestMigrationCensusTractsError).toBe(null);
  });
});

