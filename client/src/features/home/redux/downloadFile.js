import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  HOME_DOWNLOAD_FILE_BEGIN,
  HOME_DOWNLOAD_FILE_SUCCESS,
  HOME_DOWNLOAD_FILE_FAILURE,
  HOME_DOWNLOAD_FILE_DISMISS_ERROR,
} from './constants';
import {message} from "antd";
import Axios from 'axios';

export function downloadFile(path) {
    return dispatch => {
      dispatch({
        type: HOME_DOWNLOAD_FILE_BEGIN,
      });
     // const uploadUrl = isConan?"/conan/file":"/spine/file"
      //Axios.defaults.baseURL = 'https://diagpanel.azurewebsites.net';
      Axios.defaults.baseURL = 'http://127.0.0.1:8080'
      const url = `spine/file/${path}`
      return Axios(url,{
        method: 'post',
        responseType: 'blob',
      })
      .then((res)=>{
        const { data, headers } = res
        const fileName = headers['content-disposition'].replace(/\w+;filename=(.*)/, '$1')
        // 此处当返回json文件时需要先对data进行JSON.stringify处理，其他类型文件不用做处理
        //const blob = new Blob([JSON.stringify(data)], ...)
        const blob = new Blob([data], {type: headers['content-type']})
        let dom = document.createElement('a')
        let url = window.URL.createObjectURL(blob)
        dom.href = url
        dom.download = decodeURI(fileName)
        dom.style.display = 'none'
        document.body.appendChild(dom)
        dom.click()
        dom.parentNode.removeChild(dom)
        window.URL.revokeObjectURL(url)
          // dispatch({
          //   type: HOME_DOWNLOAD_FILE_SUCCESS,
          //   data: null,
          // });
      })
      .catch((err)=>{
        dispatch({
            type: HOME_DOWNLOAD_FILE_FAILURE,
            data: { error: err },
          });
          message.error("failed to download")
      })
  };
}

export function dismissDownloadFileError() {
  return {
    type: HOME_DOWNLOAD_FILE_DISMISS_ERROR,
  };
}

export function useDownloadFile() {
  const dispatch = useDispatch();

  const { downloadFilePending, downloadFileError } = useSelector(
    state => ({
      downloadFilePending: state.home.downloadFilePending,
      downloadFileError: state.home.downloadFileError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(downloadFile(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissDownloadFileError());
  }, [dispatch]);

  return {
    downloadFile: boundAction,
    downloadFilePending,
    downloadFileError,
    dismissDownloadFileError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case HOME_DOWNLOAD_FILE_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        downloadFilePending: true,
        downloadFileError: null,
      };

    case HOME_DOWNLOAD_FILE_SUCCESS:
      // The request is success
      return {
        ...state,
        downloadFilePending: false,
        downloadFileError: null,
      };

    case HOME_DOWNLOAD_FILE_FAILURE:
      // The request is failed
      return {
        ...state,
        downloadFilePending: false,
        downloadFileError: action.data.error,
      };

    case HOME_DOWNLOAD_FILE_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        downloadFileError: null,
      };

    default:
      return state;
  }
}
