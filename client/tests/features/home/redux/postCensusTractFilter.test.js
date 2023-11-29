import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  HOME_POST_CENSUS_TRACT_FILTER_BEGIN,
  HOME_POST_CENSUS_TRACT_FILTER_SUCCESS,
  HOME_POST_CENSUS_TRACT_FILTER_FAILURE,
  HOME_POST_CENSUS_TRACT_FILTER_DISMISS_ERROR,
} from '../../../../src/features/home/redux/constants';

import {
  postCensusTractFilter,
  dismissPostCensusTractFilterError,
  reducer,
} from '../../../../src/features/home/redux/postCensusTractFilter';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('home/redux/postCensusTractFilter', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when postCensusTractFilter succeeds', () => {
    const store = mockStore({});

    return store.dispatch(postCensusTractFilter())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', HOME_POST_CENSUS_TRACT_FILTER_BEGIN);
        expect(actions[1]).toHaveProperty('type', HOME_POST_CENSUS_TRACT_FILTER_SUCCESS);
      });
  });

  it('dispatches failure action when postCensusTractFilter fails', () => {
    const store = mockStore({});

    return store.dispatch(postCensusTractFilter({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', HOME_POST_CENSUS_TRACT_FILTER_BEGIN);
        expect(actions[1]).toHaveProperty('type', HOME_POST_CENSUS_TRACT_FILTER_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissPostCensusTractFilterError', () => {
    const expectedAction = {
      type: HOME_POST_CENSUS_TRACT_FILTER_DISMISS_ERROR,
    };
    expect(dismissPostCensusTractFilterError()).toEqual(expectedAction);
  });

  it('handles action type HOME_POST_CENSUS_TRACT_FILTER_BEGIN correctly', () => {
    const prevState = { postCensusTractFilterPending: false };
    const state = reducer(
      prevState,
      { type: HOME_POST_CENSUS_TRACT_FILTER_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.postCensusTractFilterPending).toBe(true);
  });

  it('handles action type HOME_POST_CENSUS_TRACT_FILTER_SUCCESS correctly', () => {
    const prevState = { postCensusTractFilterPending: true };
    const state = reducer(
      prevState,
      { type: HOME_POST_CENSUS_TRACT_FILTER_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.postCensusTractFilterPending).toBe(false);
  });

  it('handles action type HOME_POST_CENSUS_TRACT_FILTER_FAILURE correctly', () => {
    const prevState = { postCensusTractFilterPending: true };
    const state = reducer(
      prevState,
      { type: HOME_POST_CENSUS_TRACT_FILTER_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.postCensusTractFilterPending).toBe(false);
    expect(state.postCensusTractFilterError).toEqual(expect.anything());
  });

  it('handles action type HOME_POST_CENSUS_TRACT_FILTER_DISMISS_ERROR correctly', () => {
    const prevState = { postCensusTractFilterError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: HOME_POST_CENSUS_TRACT_FILTER_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.postCensusTractFilterError).toBe(null);
  });
});

