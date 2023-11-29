import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import {
  HOME_SWITCH_HEADER,
} from './constants';

export function switchHeader({title, subtitle}) {
  return {
    type: HOME_SWITCH_HEADER,
    data: {
      title,
      subtitle
    }
  };
}

export function useSwitchHeader() {
  const dispatch = useDispatch();
  const boundAction = useCallback((...params) => dispatch(switchHeader(...params)), [dispatch]);
  return { switchHeader: boundAction };
}

export function reducer(state, action) {
  switch (action.type) {
    case HOME_SWITCH_HEADER:
      return {
        ...state,
        layoutHeader: action.data,
      };

    default:
      return state;
  }
}
