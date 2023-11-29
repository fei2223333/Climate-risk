import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import { Row, Col, Space, Card, Divider,List, Typography} from 'antd';
import '../../styles/TemplateChart.less';
import { Pie } from '@ant-design/plots';

export class TemplateChart extends Component {
  constructor(props){
    super(props)
    this.downloadFile = this.downloadFile.bind(this);
  }
  state = {
    statistics: [],
  };

  componentWillUnmount(){
    
  }

  downloadFile = (key) => {
    this.props.actions.downloadFile(key);
  }

  componentDidUpdate(prevProps, prevState) {
  }

  render() {
    const pieData = this.props.data? {
      Sex_Ratio:this.props.data.sexRatio,
      Age: this.props.data.Age,
      Education: this.props.data.Education,
      Income: this.props.data.Income,
    }: null

    const aggregateData = this.props.data ? Object.entries({
      state: this.props.data.state,
      county: this.props.data.county,
      Population: this.props.data.totalPopulation,
      "Community Resilience Score": this.props.data.communityResilienceScore,
  }).map(([key, value]) => `${key}: ${value}`) : null;
  

    return this.props.data ? (
      
      <Space direction="vertical" size="middle" style={{ display: 'flex',marginTop: 30 }}>
        <span class="header">Search Results</span>
        <Card title="Aggregate Results" size="big">
        <Divider orientation="left"></Divider>
          <Row>
            <Col span={18} push={6}>
              <div>
              <List
                bordered
                dataSource={aggregateData}
                renderItem={(item) => (
                  <List.Item>
                    <Typography.Text mark>{item}</Typography.Text>
                  </List.Item>
                )}
              />
              
              </div>
            </Col>
            <Col span={6} pull={18}>
              <div>
              
              </div>
            </Col>
          </Row>
          </Card>
        <Card title="Aggregate Results">
          <Row>
          {Object.entries(pieData).map(([key, value])=>{
            let colorField;
            Object.entries(value[0]).forEach(([key, value])=>{
              if (key !== 'ratio') {
                  colorField = key;
                }
            })
            const config = {
              appendPadding: 10,
              data: value,
              angleField: 'ratio',
              colorField,
              radius: 0.75,
              label: {
                type: 'spider',
                labelHeight: 28,
                content: '{name}\n{percentage}',
              },
              interactions: [
                {
                  type: 'element-selected',
                },
                {
                  type: 'element-active',
                },
              ],
            };
            return <Col span={6}>
              <div class="chart">
                <Pie {...config} />
              </div>
            </Col>
          })}
          </Row>
        </Card>
      </Space>
    ) : null
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
    actions: bindActionCreators({ ...actions }, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TemplateChart);
