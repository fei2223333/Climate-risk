import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import {
  HOME_RESET_UPLOAD,
} from './constants';

export function resetUpload() {
  return {
    type: HOME_RESET_UPLOAD,
  };
}

export function useResetUpload() {
  const dispatch = useDispatch();
  const boundAction = useCallback((...params) => dispatch(resetUpload(...params)), [dispatch]);
  return { resetUpload: boundAction };
}

export function reducer(state, action) {
  switch (action.type) {
    case HOME_RESET_UPLOAD:
      return {
        ...state,
        isUploading:false,
        parsedData: null,
      };

    default:
      return state;
  }
}
