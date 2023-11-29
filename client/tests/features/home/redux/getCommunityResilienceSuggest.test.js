import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  HOME_GET_COMMUNITY_RESILIENCE_SUGGEST_BEGIN,
  HOME_GET_COMMUNITY_RESILIENCE_SUGGEST_SUCCESS,
  HOME_GET_COMMUNITY_RESILIENCE_SUGGEST_FAILURE,
  HOME_GET_COMMUNITY_RESILIENCE_SUGGEST_DISMISS_ERROR,
} from '../../../../src/features/home/redux/constants';

import {
  getCommunityResilienceSuggest,
  dismissGetCommunityResilienceSuggestError,
  reducer,
} from '../../../../src/features/home/redux/getCommunityResilienceSuggest';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('home/redux/getCommunityResilienceSuggest', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when getCommunityResilienceSuggest succeeds', () => {
    const store = mockStore({});

    return store.dispatch(getCommunityResilienceSuggest())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', HOME_GET_COMMUNITY_RESILIENCE_SUGGEST_BEGIN);
        expect(actions[1]).toHaveProperty('type', HOME_GET_COMMUNITY_RESILIENCE_SUGGEST_SUCCESS);
      });
  });

  it('dispatches failure action when getCommunityResilienceSuggest fails', () => {
    const store = mockStore({});

    return store.dispatch(getCommunityResilienceSuggest({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', HOME_GET_COMMUNITY_RESILIENCE_SUGGEST_BEGIN);
        expect(actions[1]).toHaveProperty('type', HOME_GET_COMMUNITY_RESILIENCE_SUGGEST_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissGetCommunityResilienceSuggestError', () => {
    const expectedAction = {
      type: HOME_GET_COMMUNITY_RESILIENCE_SUGGEST_DISMISS_ERROR,
    };
    expect(dismissGetCommunityResilienceSuggestError()).toEqual(expectedAction);
  });

  it('handles action type HOME_GET_COMMUNITY_RESILIENCE_SUGGEST_BEGIN correctly', () => {
    const prevState = { getCommunityResilienceSuggestPending: false };
    const state = reducer(
      prevState,
      { type: HOME_GET_COMMUNITY_RESILIENCE_SUGGEST_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.getCommunityResilienceSuggestPending).toBe(true);
  });

  it('handles action type HOME_GET_COMMUNITY_RESILIENCE_SUGGEST_SUCCESS correctly', () => {
    const prevState = { getCommunityResilienceSuggestPending: true };
    const state = reducer(
      prevState,
      { type: HOME_GET_COMMUNITY_RESILIENCE_SUGGEST_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.getCommunityResilienceSuggestPending).toBe(false);
  });

  it('handles action type HOME_GET_COMMUNITY_RESILIENCE_SUGGEST_FAILURE correctly', () => {
    const prevState = { getCommunityResilienceSuggestPending: true };
    const state = reducer(
      prevState,
      { type: HOME_GET_COMMUNITY_RESILIENCE_SUGGEST_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.getCommunityResilienceSuggestPending).toBe(false);
    expect(state.getCommunityResilienceSuggestError).toEqual(expect.anything());
  });

  it('handles action type HOME_GET_COMMUNITY_RESILIENCE_SUGGEST_DISMISS_ERROR correctly', () => {
    const prevState = { getCommunityResilienceSuggestError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: HOME_GET_COMMUNITY_RESILIENCE_SUGGEST_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.getCommunityResilienceSuggestError).toBe(null);
  });
});

