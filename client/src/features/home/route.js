import {
  WelcomePage,
  TemplateChart,
  ConanLayout,
  CensusTractFilter,
  CensusTractRank,
  ClimateResilienceScore,
} from './';

export default {
  path: '',
  childRoutes: [
    { path: '/', component: ConanLayout, name:'conan'},
  { path: 'climate_risk', component: ConanLayout, name:'conan'},
  {path: 'census_tract_filter', component: CensusTractFilter, name:"CensusTractFilter"},
    { path: '/census_tract_rank', component: CensusTractRank },
    { path: '/climate_resilience_score', component: ClimateResilienceScore }
  ],
};
