import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import {UploadComponent,CommunityResilence,ConanContent} from '.';

export class ConanLayout extends Component {
  static propTypes = {
    home: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  componentDidMount() {
    this.props.actions.switchHeader({
      title: 'Climate Risk',
      subtitle: 'Community Resilence Search Tool',
    });
  }

  componentDidMount() {
    this.props.actions.getCommunityResilienceSuggest();
  }

  componentWillUnmount() {
    this.props.actions.resetUpload();
  }

  render() {
    return (
      <div className="home-conan-layout">
        {this.props.home.communityResilenceSearchSuggest?<UploadComponent type="conan" searchFields={this.props.home.communityResilenceSearchSuggest}/>:null}
        <ConanContent data={this.props.home.communityResilenceSearchResults} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    home: state.home,
  };
}

/* istanbul ignore next */
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...actions }, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ConanLayout);
