import {
  HOME_RESET_UPLOAD,
} from '../../../../src/features/home/redux/constants';

import {
  resetUpload,
  reducer,
} from '../../../../src/features/home/redux/resetUpload';

describe('home/redux/resetUpload', () => {
  it('returns correct action by resetUpload', () => {
    expect(resetUpload()).toHaveProperty('type', HOME_RESET_UPLOAD);
  });

  it('handles action type HOME_RESET_UPLOAD correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: HOME_RESET_UPLOAD }
    );
    // Should be immutable
    expect(state).not.toBe(prevState);

    // TODO: use real case expected value instead of {}.
    const expectedState = {};
    expect(state).toEqual(expectedState);
  });
});
