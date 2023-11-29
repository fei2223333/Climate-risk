import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import {Tabs} from 'antd';
import RankTable from './RankTable';

export class ClimateResilienceScore extends Component {
  static propTypes = {
    home: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  componentDidMount() {
    this.props.actions.getAverageClimateRiskByIncome();
    this.props.actions.getAverageClimateRiskByState();
  }

  render() {
    return (
      <div className="home-climate-resilience-score">
        <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="Average Climate Risk By State" key="1">
          {this.props.home.averageClimateRiskByStateResult? <RankTable data={this.props.home.averageClimateRiskByStateResult}/>: null}
        </Tabs.TabPane>
        <Tabs.TabPane tab="Average Climate Risk By Income" key="2">
        {this.props.home.averageClimateRiskByIncomeResult? <RankTable data={this.props.home.averageClimateRiskByIncomeResult}/>: null}
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
)(ClimateResilienceScore);
