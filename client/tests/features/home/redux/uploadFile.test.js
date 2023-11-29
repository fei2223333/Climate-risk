import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  HOME_UPLOAD_FILE_BEGIN,
  HOME_UPLOAD_FILE_SUCCESS,
  HOME_UPLOAD_FILE_FAILURE,
  HOME_UPLOAD_FILE_DISMISS_ERROR,
} from '../../../../src/features/home/redux/constants';

import {
  uploadFile,
  dismissUploadFileError,
  reducer,
} from '../../../../src/features/home/redux/uploadFile';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('home/redux/uploadFile', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when uploadFile succeeds', () => {
    const store = mockStore({});

    return store.dispatch(uploadFile())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', HOME_UPLOAD_FILE_BEGIN);
        expect(actions[1]).toHaveProperty('type', HOME_UPLOAD_FILE_SUCCESS);
      });
  });

  it('dispatches failure action when uploadFile fails', () => {
    const store = mockStore({});

    return store.dispatch(uploadFile({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', HOME_UPLOAD_FILE_BEGIN);
        expect(actions[1]).toHaveProperty('type', HOME_UPLOAD_FILE_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissUploadFileError', () => {
    const expectedAction = {
      type: HOME_UPLOAD_FILE_DISMISS_ERROR,
    };
    expect(dismissUploadFileError()).toEqual(expectedAction);
  });

  it('handles action type HOME_UPLOAD_FILE_BEGIN correctly', () => {
    const prevState = { uploadFilePending: false };
    const state = reducer(
      prevState,
      { type: HOME_UPLOAD_FILE_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.uploadFilePending).toBe(true);
  });

  it('handles action type HOME_UPLOAD_FILE_SUCCESS correctly', () => {
    const prevState = { uploadFilePending: true };
    const state = reducer(
      prevState,
      { type: HOME_UPLOAD_FILE_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.uploadFilePending).toBe(false);
  });

  it('handles action type HOME_UPLOAD_FILE_FAILURE correctly', () => {
    const prevState = { uploadFilePending: true };
    const state = reducer(
      prevState,
      { type: HOME_UPLOAD_FILE_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.uploadFilePending).toBe(false);
    expect(state.uploadFileError).toEqual(expect.anything());
  });

  it('handles action type HOME_UPLOAD_FILE_DISMISS_ERROR correctly', () => {
    const prevState = { uploadFileError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: HOME_UPLOAD_FILE_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.uploadFileError).toBe(null);
  });
});

