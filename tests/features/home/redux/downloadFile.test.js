import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  HOME_DOWNLOAD_FILE_BEGIN,
  HOME_DOWNLOAD_FILE_SUCCESS,
  HOME_DOWNLOAD_FILE_FAILURE,
  HOME_DOWNLOAD_FILE_DISMISS_ERROR,
} from '../../../../src/features/home/redux/constants';

import {
  downloadFile,
  dismissDownloadFileError,
  reducer,
} from '../../../../src/features/home/redux/downloadFile';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('home/redux/downloadFile', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when downloadFile succeeds', () => {
    const store = mockStore({});

    return store.dispatch(downloadFile())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', HOME_DOWNLOAD_FILE_BEGIN);
        expect(actions[1]).toHaveProperty('type', HOME_DOWNLOAD_FILE_SUCCESS);
      });
  });

  it('dispatches failure action when downloadFile fails', () => {
    const store = mockStore({});

    return store.dispatch(downloadFile({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', HOME_DOWNLOAD_FILE_BEGIN);
        expect(actions[1]).toHaveProperty('type', HOME_DOWNLOAD_FILE_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissDownloadFileError', () => {
    const expectedAction = {
      type: HOME_DOWNLOAD_FILE_DISMISS_ERROR,
    };
    expect(dismissDownloadFileError()).toEqual(expectedAction);
  });

  it('handles action type HOME_DOWNLOAD_FILE_BEGIN correctly', () => {
    const prevState = { downloadFilePending: false };
    const state = reducer(
      prevState,
      { type: HOME_DOWNLOAD_FILE_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.downloadFilePending).toBe(true);
  });

  it('handles action type HOME_DOWNLOAD_FILE_SUCCESS correctly', () => {
    const prevState = { downloadFilePending: true };
    const state = reducer(
      prevState,
      { type: HOME_DOWNLOAD_FILE_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.downloadFilePending).toBe(false);
  });

  it('handles action type HOME_DOWNLOAD_FILE_FAILURE correctly', () => {
    const prevState = { downloadFilePending: true };
    const state = reducer(
      prevState,
      { type: HOME_DOWNLOAD_FILE_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.downloadFilePending).toBe(false);
    expect(state.downloadFileError).toEqual(expect.anything());
  });

  it('handles action type HOME_DOWNLOAD_FILE_DISMISS_ERROR correctly', () => {
    const prevState = { downloadFileError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: HOME_DOWNLOAD_FILE_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.downloadFileError).toBe(null);
  });
});

