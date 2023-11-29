import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import { Upload, message, Button, Form, InputNumber, Divider, Select, Slider } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import '../../styles/SpineContent.less';

const { Dragger } = Upload;

export class UploadComponent extends Component {
  static propTypes = {
    home: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      fileList: [], //文件列表，用于控制upload组件
      iterationSteps: 500,
      iterationStepsValidStatus: 'success',
      iterationStepsErrorMsg: null,
      patternNumber: 10,
      patternNumberValidStatus: 'success',
      patternNumberErrorMsg: null,
      patternLength: 5,
      patternLengthValidStatus: 'success',
      patternLengthErrorMsg: null,
      state: null,
      county: null,
      fipsName: null,
      climateChangeImpactCategories: null,
      individualIncome: null,
      selectedState: undefined,
      selectedCounty: undefined,
      selectedFipsCode: undefined,
      counties: [],
      fipsCodes: [],
    };
    this.handleUploadCommunityResilence = this.handleUploadCommunityResilence.bind(this);
    this.handleUploadCensusTractFilter = this.handleUploadCensusTractFilter.bind(this);
  }

  handleStateChange = (value) => {
    const field = this.props.searchFields.find(field => field.state === value);
    const counties = field ? field.county : [];
    this.setState({ selectedState: value, counties, selectedCounty: undefined, selectedFipsCode: undefined, fipsCodes: [] });
  }
  

  handleCountyChange = (value) => {
    const countyObj = this.state.counties.find(county => Object.keys(county)[0] === value);
    const fipsCodes = countyObj ? countyObj[value] : [];
    this.setState({ selectedCounty: value, fipsCodes, selectedFipsCode: undefined });
  }
  

  handleFipsCodeChange = (value) => {
    this.setState({ selectedFipsCode: value });
  }
  handleUploadCommunityResilence() {
    if(!this.state.selectedState || !this.state.selectedCounty || !this.state.selectedFipsCode){
      message.error("Please fill the form")
      return;
    }
    const formData = {
      selectedState: this.state.selectedState,
      selectedCounty: this.state.selectedCounty,
      selectedFIPSCode11: this.state.selectedFipsCode,
    };

    this.props.actions.getCommunityResilenceSearchResults(formData);
  }

  handleUploadCensusTractFilter() {
    if(!this.state.selectedState || !this.state.selectedCounty || !this.state.selectedFipsCode){
      message.error("Please fill the form")
      return;
    }
    const formData = {
      selectedState: this.state.selectedState,
      selectedCounties: this.state.selectedCounty,
      selectedHazardTypes: this.state.selectedFipsCode,
    };
    this.props.actions.postCensusTractFilter(formData);
  }

  validatePatternNumber = number => {
    const MIN = 1;
    const MAX = 30;
    if (typeof number === 'number' && number >= MIN && number <= MAX) {
      return {
        patternNumberValidStatus: 'success',
        patternNumberErrorMsg: null,
      };
    }

    return {
      patternNumberValidStatus: 'error',
      patternNumberErrorMsg: 'Please input a number between 1 to 30',
    };
  };

  validatePatternLength = length => {
    const MIN = 1;
    const MAX = 8;
    if (typeof length === 'number' && length >= MIN && length <= MAX) {
      return {
        patternLengthValidStatus: 'success',
        patternLengthErrorMsg: null,
      };
    }

    return {
      patternLengthValidStatus: 'error',
      patternLengthErrorMsg: 'Please input a length between 1 to 8',
    };
  };

  validateIterationSteps = number => {
    const MIN = 1;
    const MAX = 2000;
    if (typeof number === 'number' && number >= MIN && number <= MAX) {
      return {
        iterationStepsValidStatus: 'success',
        iterationStepsErrorMsg: null,
      };
    }

    return {
      iterationStepsValidStatus: 'error',
      iterationStepsErrorMsg: 'Please input a number between 1 to 30',
    };
  };

  onPatternNumberChange = patternNumber => {
    this.setState({
      ...this.validatePatternNumber(patternNumber),
      patternNumber,
    });
  };

  onPatternLengthChange = patternLength => {
    this.setState({
      ...this.validatePatternLength(patternLength),
      patternLength,
    });
  };

  onIterationStepsChange = iterationSteps => {
    this.setState({
      ...this.validateIterationSteps(iterationSteps),
      iterationSteps,
    });
  };

  render() {
    const formItemLayout = {
      labelCol: { span: 10 },
      wrapperCol: { span: 12 },
    };
    return (
      <div>
        <Form>
          <Divider />
          <Form.Item {...formItemLayout} label="State" help={this.state.iterationStepsErrorMsg}>
            <Select defaultValue="" style={{ width: '50%' }} placeholder="Select a state"
              optionFilterProp="children"
              onChange={this.handleStateChange}
              value={this.state.selectedState}
            >
              {this.props.searchFields.map(field => (
                <Select.Option key={field.state} value={field.state}>{field.state}</Select.Option>
              ))}
            </Select>
            </Form.Item>
            <Form.Item {...formItemLayout} label="County" help={this.state.iterationStepsErrorMsg}>
            <Select style={{ width: '50%' }} placeholder="Select a county"
            optionFilterProp="children"
            onChange={this.handleCountyChange}
            value={this.state.selectedCounty}
            disabled={!this.state.selectedState}
          >
          {this.state.counties.map(county => (
            <Select.Option key={Object.keys(county)[0]} value={Object.keys(county)[0]}>{Object.keys(county)[0]}</Select.Option>
          ))}
        </Select>
          </Form.Item>
          {this.props.type === 'conan' ? (
            <div>
              <Form.Item
                {...formItemLayout}
                label="FIPS-Name"
                validateStatus={this.state.patternLengthValidStatus}
                help={this.state.patternLengthErrorMsg}
              >
                <Select style={{ width: '50%' }} placeholder="Select a FIPS Code"
                  optionFilterProp="children"
                  onChange={this.handleFipsCodeChange}
                  value={this.state.selectedFipsCode}
                  disabled={!this.state.selectedCounty}
                >
                  {this.state.fipsCodes.map(fipsCode => (
                    <Select.Option key={fipsCode} value={fipsCode}>{fipsCode}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Button
                type="primary"
                onClick={this.handleUploadCommunityResilence}
                loading={this.props.home.isUploading}
                size="large"
                style={{ marginTop: 16, marginLeft: '47%' }}
              >
                {this.props.home.isUploading ? 'Uploading' : 'Submit'}
              </Button>
            </div>
          ) : (
            <div>
              <Form.Item
                {...formItemLayout}
                label="Climate change impact categories"
                help={this.state.patternNumberErrorMsg}
              >
                <Select
                  style={{ width: '50%' }}
                  optionFilterProp="children"
                  onChange={this.handleFipsCodeChange}
                  value={this.state.selectedFipsCode}
                  disabled={!this.state.selectedCounty}
                >
                  {this.state.fipsCodes.map(fipsCode => (
                    <Select.Option key={fipsCode} value={fipsCode}>{fipsCode}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
              {/* <Form.Item {...formItemLayout} help={this.state.patternNumberErrorMsg}>
                <Slider
                  min={0}
                  max={50}
                  onChange={r => {
                    this.setState({ individualIncome: r.value });
                  }}
                  value={this.state.individualIncome}
                />
              </Form.Item> */}
              <Button
                type="primary"
                onClick={this.handleUploadCensusTractFilter}
                loading={this.props.home.isUploading}
                size="large"
                style={{ marginTop: 16, marginLeft: '47%' }}
              >
                {this.props.home.isUploading ? 'Uploading' : 'Submit'}
              </Button>
            </div>
          )}
        </Form>
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
    actions: bindActionCreators({ ...actions }, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UploadComponent);