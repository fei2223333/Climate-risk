import initialState from './initialState';
import { reducer as uploadFileReducer } from './uploadFile';
import { reducer as switchHeaderReducer } from './switchHeader';
import { reducer as resetUploadReducer } from './resetUpload';
import { reducer as downloadFileReducer } from './downloadFile';
import { reducer as getCommunityResilenceSearchResultsReducer } from './getCommunityResilenceSearchResults';
import { reducer as postCensusTractFilterReducer } from './postCensusTractFilter';
import { reducer as getHighestRiskCensusTractsReducer } from './getHighestRiskCensusTracts';
import { reducer as getLowestRiskCensusTractsReducer } from './getLowestRiskCensusTracts';
import { reducer as getLowestMigrationCensusTractsReducer } from './getLowestMigrationCensusTracts';
import { reducer as getHighestMigrationCensusTractsReducer } from './getHighestMigrationCensusTracts';
import { reducer as getAverageClimateRiskByStateReducer } from './getAverageClimateRiskByState';
import { reducer as getAverageClimateRiskByIncomeReducer } from './getAverageClimateRiskByIncome';
import { reducer as getCensusTractFilterSearchResultReducer } from './getCensusTractFilterSearchResult';
import { reducer as getCommunityResilienceSuggestReducer } from './getCommunityResilienceSuggest';

const reducers = [
  uploadFileReducer,
  switchHeaderReducer,
  resetUploadReducer,
  downloadFileReducer,
  getCommunityResilenceSearchResultsReducer,
  postCensusTractFilterReducer,
  getHighestRiskCensusTractsReducer,
  getLowestRiskCensusTractsReducer,
  getLowestMigrationCensusTractsReducer,
  getHighestMigrationCensusTractsReducer,
  getAverageClimateRiskByStateReducer,
  getAverageClimateRiskByIncomeReducer,
  getCensusTractFilterSearchResultReducer,
  getCommunityResilienceSuggestReducer,
];

export default function reducer(state = initialState, action) {
  let newState;
  switch (action.type) {
    // Handle cross-topic actions here
    default:
      newState = state;
      break;
  }
  /* istanbul ignore next */
  return reducers.reduce((s, r) => r(s, action), newState);
}
