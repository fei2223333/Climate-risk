import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  HOME_GET_LOWEST_MIGRATION_CENSUS_TRACTS_BEGIN,
  HOME_GET_LOWEST_MIGRATION_CENSUS_TRACTS_SUCCESS,
  HOME_GET_LOWEST_MIGRATION_CENSUS_TRACTS_FAILURE,
  HOME_GET_LOWEST_MIGRATION_CENSUS_TRACTS_DISMISS_ERROR,
} from '../../../../src/features/home/redux/constants';

import {
  getLowestMigrationCensusTracts,
  dismissGetLowestMigrationCensusTractsError,
  reducer,
} from '../../../../src/features/home/redux/getLowestMigrationCensusTracts';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('home/redux/getLowestMigrationCensusTracts', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when getLowestMigrationCensusTracts succeeds', () => {
    const store = mockStore({});

    return store.dispatch(getLowestMigrationCensusTracts())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', HOME_GET_LOWEST_MIGRATION_CENSUS_TRACTS_BEGIN);
        expect(actions[1]).toHaveProperty('type', HOME_GET_LOWEST_MIGRATION_CENSUS_TRACTS_SUCCESS);
      });
  });

  it('dispatches failure action when getLowestMigrationCensusTracts fails', () => {
    const store = mockStore({});

    return store.dispatch(getLowestMigrationCensusTracts({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', HOME_GET_LOWEST_MIGRATION_CENSUS_TRACTS_BEGIN);
        expect(actions[1]).toHaveProperty('type', HOME_GET_LOWEST_MIGRATION_CENSUS_TRACTS_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissGetLowestMigrationCensusTractsError', () => {
    const expectedAction = {
      type: HOME_GET_LOWEST_MIGRATION_CENSUS_TRACTS_DISMISS_ERROR,
    };
    expect(dismissGetLowestMigrationCensusTractsError()).toEqual(expectedAction);
  });

  it('handles action type HOME_GET_LOWEST_MIGRATION_CENSUS_TRACTS_BEGIN correctly', () => {
    const prevState = { getLowestMigrationCensusTractsPending: false };
    const state = reducer(
      prevState,
      { type: HOME_GET_LOWEST_MIGRATION_CENSUS_TRACTS_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.getLowestMigrationCensusTractsPending).toBe(true);
  });

  it('handles action type HOME_GET_LOWEST_MIGRATION_CENSUS_TRACTS_SUCCESS correctly', () => {
    const prevState = { getLowestMigrationCensusTractsPending: true };
    const state = reducer(
      prevState,
      { type: HOME_GET_LOWEST_MIGRATION_CENSUS_TRACTS_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.getLowestMigrationCensusTractsPending).toBe(false);
  });

  it('handles action type HOME_GET_LOWEST_MIGRATION_CENSUS_TRACTS_FAILURE correctly', () => {
    const prevState = { getLowestMigrationCensusTractsPending: true };
    const state = reducer(
      prevState,
      { type: HOME_GET_LOWEST_MIGRATION_CENSUS_TRACTS_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.getLowestMigrationCensusTractsPending).toBe(false);
    expect(state.getLowestMigrationCensusTractsError).toEqual(expect.anything());
  });

  it('handles action type HOME_GET_LOWEST_MIGRATION_CENSUS_TRACTS_DISMISS_ERROR correctly', () => {
    const prevState = { getLowestMigrationCensusTractsError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: HOME_GET_LOWEST_MIGRATION_CENSUS_TRACTS_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.getLowestMigrationCensusTractsError).toBe(null);
  });
});

