import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  HOME_UPLOAD_FILE_BEGIN,
  HOME_UPLOAD_FILE_SUCCESS,
  HOME_UPLOAD_FILE_FAILURE,
  HOME_UPLOAD_FILE_DISMISS_ERROR,
} from './constants';
import {message} from "antd";
import Axios from 'axios';

export function uploadFile(data, isConan) {
  return dispatch => {
    // optionally you can have getState as the second argument
    dispatch({
      type: HOME_UPLOAD_FILE_BEGIN,
    });
    const uploadUrl = isConan?"/conan/file":"/spine/file"
    // Axios.defaults.baseURL = 'https://diagpanel.azurewebsites.net';
    Axios.defaults.baseURL = 'http://127.0.0.1:8080'
    return Axios(uploadUrl,{
      method: 'post',
      data,
      headers: { 'Content-Type': 'multipart/form-data' },
    })
      .then(data => {
        // const data = flag
        //   ? {
        //       list: [
        //         {
        //           version: 'A',
        //           cluster: 'C-1',
        //           api: 'API-1-1',
        //           weight: 50,
        //           label: 1,
        //           score: 0.97,
        //         },
        //         {
        //           version: 'A',
        //           cluster: 'C-1',
        //           api: 'API-1-1',
        //           weight: 50,
        //           label: 1,
        //           score: 0.96,
        //         },
        //         {
        //           version: 'A',
        //           cluster: 'C-1',
        //           api: 'API-1-1',
        //           weight: 50,
        //           label: 1,
        //           score: 0.95,
        //         },
        //         {
        //           version: 'A',
        //           cluster: 'C-1',
        //           api: 'API-1-1',
        //           weight: 50,
        //           label: 1,
        //           score: 0.92,
        //         },
        //         {
        //           version: 'A',
        //           cluster: 'C-1',
        //           api: 'API-1-1',
        //           weight: 50,
        //           label: 1,
        //           score: 0.98,
        //         },
        //       ],
        //     }
        //   : {
        //       parsed_log_file_path: 'mntlogs\\2022-03-23\\test.csv',
        //       log_statistics: {
        //         total_log_size: 10000,
        //         template_num: 20,
        //         log_template_mapping: {
        //           temp_1: 2000,
        //           temp_2: 500,
        //           temp_3: 150,
        //           temp_4: 800,
        //           temp_5: 1200,
        //         },
        //       },
        //       log_sample_results: {
        //         Item_1: {
        //           raw_log: 'receive block 203 from 230.106.70.20',
        //           log_template: 'receive block * from *',
        //           parameters: ['203', '230.106.70.20'],
        //         },
        //       },
        //     };
        if(data.status !== 200) throw new Error();
        let beautifiedData;
        if (isConan) {
          beautifiedData = {
            list: data.data.data.map((d, index) => {
              let s = '';
              Object.keys(d.diagnosis_results).forEach(key => {
                s += `${key}:${d.diagnosis_results[key]}, `;
              });
              var reg = /, $/gi;
              s = s.replace(reg, '');
              return {
                rank: index + 1,
                score: d.score,
                rootCause: s,
              };
            }),
          };
        } else{
          beautifiedData = {...data.data.data};
          beautifiedData.log_sample_results = Object.values(beautifiedData.log_sample_results).map((result)=>{
            return {
              ...result,
              Parameters:result.Parameters.join(", ")
            }
          })
        }
        dispatch({
          type: HOME_UPLOAD_FILE_SUCCESS,
          data: beautifiedData,
          isConan,
        });
        //})
        // .catch(err => {

        // })
      })
      .catch(err => {
        console.log(err);
            dispatch({
              type: HOME_UPLOAD_FILE_FAILURE,
              data: { error: err },
            });
            message.error("Failed to upload")
      });
  };
}

export function dismissUploadFileError() {
  return {
    type: HOME_UPLOAD_FILE_DISMISS_ERROR,
  };
}

export function useUploadFile() {
  const dispatch = useDispatch();

  const { uploadFilePending, uploadFileError } = useSelector(
    state => ({
      uploadFilePending: state.home.uploadFilePending,
      uploadFileError: state.home.uploadFileError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback(
    (...args) => {
      return dispatch(uploadFile(...args));
    },
    [dispatch],
  );

  const boundDismissError = useCallback(() => {
    return dispatch(dismissUploadFileError());
  }, [dispatch]);

  return {
    uploadFile: boundAction,
    uploadFilePending,
    uploadFileError,
    dismissUploadFileError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case HOME_UPLOAD_FILE_BEGIN:
      // Just after a request is sent

      return {
        ...state,
        uploadFilePending: true,
        uploadFileError: null,
        isUploading: true,
      };

    case HOME_UPLOAD_FILE_SUCCESS:
      // The request is success
      console.log(action.data);

      return action.isConan
        ? {
            ...state,
            uploadFilePending: false,
            uploadFileError: null,
            isUploading: false,
            conanData: action.data,
          }
        : {
            ...state,
            uploadFilePending: false,
            uploadFileError: null,
            isUploading: false,
            parsedData: action.data,
            fileDownloadKey: action.data.parsed_log_file_path,
          };

    case HOME_UPLOAD_FILE_FAILURE:
      // The request is failed
      return {
        ...state,
        uploadFilePending: false,
        isUploading: false,
        uploadFileError: action.data.error,
      };

    case HOME_UPLOAD_FILE_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        uploadFileError: null,
      };

    default:
      return state;
  }
}
