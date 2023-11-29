import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import {Tabs} from 'antd';
import RankTable from './RankTable';

export class CensusTractRank extends Component {
  static propTypes = {
    home: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  componentDidMount() {
    this.props.actions.getLowestRiskCensusTracts();
    this.props.actions.getLowestMigrationCensusTracts();
    this.props.actions.getHighestRiskCensusTracts();
    this.props.actions.getHighestMigrationCensusTracts();
  }

  render() {
    return (
      <div className="home-census-tract-rank">
        <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="Highest Risk Census Tracts" key="1">
          {this.props.home.highestRiskCensusTractsResult? <RankTable data={this.props.home.highestRiskCensusTractsResult}/>: null}
        </Tabs.TabPane>
        <Tabs.TabPane tab="Lowest RIsk Census Tracts" key="2">
        {this.props.home.lowestRiskCensusTractsResult? <RankTable data={this.props.home.lowestRiskCensusTractsResult}/>: null}
        </Tabs.TabPane>
        <Tabs.TabPane tab="Highest Migration Level" key="3">
        {this.props.home.highestMigrationCensusTractsResult? <RankTable data={this.props.home.highestMigrationCensusTractsResult}/>: null}
        </Tabs.TabPane>
        <Tabs.TabPane tab="Lowest Migration Level" key="4">
        {this.props.home.lowestMigrationCensusTractsResult? <RankTable data={this.props.home.lowestMigrationCensusTractsResult}/>: null}
        </Tabs.TabPane>
      </Tabs>
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
)(CensusTractRank);
