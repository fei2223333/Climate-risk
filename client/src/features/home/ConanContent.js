import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import { Row, Col, Space, Card, Divider, Table, PageHeader } from 'antd';
import '../../styles/TemplateChart.less';

export class ConanContent extends Component {
  render() {
    

    const columns = [
      {
        title: 'socialVulnerabilityScore',
        dataIndex: 'socialVulnerabilityScore',
        key: 'socialVulnerabilityScore',
      },
      {
        title: 'communityResilienceScore',
        dataIndex: 'communityResilienceScore',
        key: 'communityResilienceScore',
      },
      {
        title: 'climateRiskScore',
        dataIndex: 'climateRiskScore',
        key: 'climateRiskScore',
      },
    ];

    return this.props.data ? (
      <Space direction="vertical" size="middle" style={{ display: 'flex', marginTop: 30 }}>
        <Card title="Search Results">
          <Table columns={columns} dataSource={this.props.data} />
        </Card>
      </Space>
    ) : null;
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
)(ConanContent);
