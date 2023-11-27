import {
  HOME_SWITCH_HEADER,
} from '../../../../src/features/home/redux/constants';

import {
  switchHeader,
  reducer,
} from '../../../../src/features/home/redux/switchHeader';

describe('home/redux/switchHeader', () => {
  it('returns correct action by switchHeader', () => {
    expect(switchHeader()).toHaveProperty('type', HOME_SWITCH_HEADER);
  });

  it('handles action type HOME_SWITCH_HEADER correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: HOME_SWITCH_HEADER }
    );
    // Should be immutable
    expect(state).not.toBe(prevState);

    // TODO: use real case expected value instead of {}.
    const expectedState = {};
    expect(state).toEqual(expectedState);
  });
});
