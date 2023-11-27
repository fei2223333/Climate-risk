import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  HOME_GET_COMMUNITY_RESILENCE_SEARCH_RESULTS_BEGIN,
  HOME_GET_COMMUNITY_RESILENCE_SEARCH_RESULTS_SUCCESS,
  HOME_GET_COMMUNITY_RESILENCE_SEARCH_RESULTS_FAILURE,
  HOME_GET_COMMUNITY_RESILENCE_SEARCH_RESULTS_DISMISS_ERROR,
} from '../../../../src/features/home/redux/constants';

import {
  getCommunityResilenceSearchResults,
  dismissGetCommunityResilenceSearchResultsError,
  reducer,
} from '../../../../src/features/home/redux/getCommunityResilenceSearchResults';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('home/redux/getCommunityResilenceSearchResults', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when getCommunityResilenceSearchResults succeeds', () => {
    const store = mockStore({});

    return store.dispatch(getCommunityResilenceSearchResults())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', HOME_GET_COMMUNITY_RESILENCE_SEARCH_RESULTS_BEGIN);
        expect(actions[1]).toHaveProperty('type', HOME_GET_COMMUNITY_RESILENCE_SEARCH_RESULTS_SUCCESS);
      });
  });

  it('dispatches failure action when getCommunityResilenceSearchResults fails', () => {
    const store = mockStore({});

    return store.dispatch(getCommunityResilenceSearchResults({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', HOME_GET_COMMUNITY_RESILENCE_SEARCH_RESULTS_BEGIN);
        expect(actions[1]).toHaveProperty('type', HOME_GET_COMMUNITY_RESILENCE_SEARCH_RESULTS_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissGetCommunityResilenceSearchResultsError', () => {
    const expectedAction = {
      type: HOME_GET_COMMUNITY_RESILENCE_SEARCH_RESULTS_DISMISS_ERROR,
    };
    expect(dismissGetCommunityResilenceSearchResultsError()).toEqual(expectedAction);
  });

  it('handles action type HOME_GET_COMMUNITY_RESILENCE_SEARCH_RESULTS_BEGIN correctly', () => {
    const prevState = { getCommunityResilenceSearchResultsPending: false };
    const state = reducer(
      prevState,
      { type: HOME_GET_COMMUNITY_RESILENCE_SEARCH_RESULTS_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.getCommunityResilenceSearchResultsPending).toBe(true);
  });

  it('handles action type HOME_GET_COMMUNITY_RESILENCE_SEARCH_RESULTS_SUCCESS correctly', () => {
    const prevState = { getCommunityResilenceSearchResultsPending: true };
    const state = reducer(
      prevState,
      { type: HOME_GET_COMMUNITY_RESILENCE_SEARCH_RESULTS_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.getCommunityResilenceSearchResultsPending).toBe(false);
  });

  it('handles action type HOME_GET_COMMUNITY_RESILENCE_SEARCH_RESULTS_FAILURE correctly', () => {
    const prevState = { getCommunityResilenceSearchResultsPending: true };
    const state = reducer(
      prevState,
      { type: HOME_GET_COMMUNITY_RESILENCE_SEARCH_RESULTS_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.getCommunityResilenceSearchResultsPending).toBe(false);
    expect(state.getCommunityResilenceSearchResultsError).toEqual(expect.anything());
  });

  it('handles action type HOME_GET_COMMUNITY_RESILENCE_SEARCH_RESULTS_DISMISS_ERROR correctly', () => {
    const prevState = { getCommunityResilenceSearchResultsError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: HOME_GET_COMMUNITY_RESILENCE_SEARCH_RESULTS_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.getCommunityResilenceSearchResultsError).toBe(null);
  });
});

