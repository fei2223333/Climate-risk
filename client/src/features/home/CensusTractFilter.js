import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import {UploadComponent} from '.';
import TemplateChart from './TemplateChart';

export class CensusTractFilter extends Component {
  static propTypes = {
    home: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  componentDidMount() {
    this.props.actions.getCensusTractFilterSearchResult();
  }

  render() {
    return (
      <div className="home-census-tract-filter">
         {this.props.home.censusTractFilterSuggest?<UploadComponent type="CensusTractFilter" searchFields={this.props.home.censusTractFilterSuggest}/>:null}
         {this.props.home.censusTractFilterResult? this.props.home.censusTractFilterResult.map((d)=><TemplateChart  data={d} />):null}
      </div>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    home: state.home,
  };
}

/* istanbul ignore next */
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...actions }, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CensusTractFilter);
