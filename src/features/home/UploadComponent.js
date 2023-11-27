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
    };
    this.handleUploadCommunityResilence = this.handleUploadCommunityResilence.bind(this);
    this.handleUploadCensusTractFilter = this.handleUploadCensusTractFilter.bind(this);
  }

  handleFileChange = ({ file, fileList }) => {
    //处理文件change，保证用户选择的文件只有一个
    const { status } = file;
    if (file.size / 1024 / 1024 > 50) {
      message.error(`${file.name} has exceeded 50 MB.`);
      return;
    }
    this.setState({
      fileList,
    });
  };

  handleUploadCommunityResilence() {
    const formData = {
      state: this.state.state,
      county: this.state.county,
      fipsName: this.state.fipsName,
    };

    this.props.actions.getCommunityResilenceSearchResults(formData);
  }

  handleUploadCensusTractFilter() {
    const formData = {
      state: this.state.state,
      county: this.state.county,
      individualIncome: this.state.individualIncome,
      climateChangeImpactCategories: this.state.climateChangeImpactCategories
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
            <Select defaultValue="" style={{ width: '50%' }} options={this.props.home.searchFields.states} />
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="County"
            validateStatus={this.state.patternNumberValidStatus}
            help={this.state.patternNumberErrorMsg}
          >
            <Select style={{ width: '50%' }} defaultValue="" options={this.props.home.searchFields.county} />
          </Form.Item>
          {this.props.type === 'conan' ? (
            <div>
              <Form.Item
                {...formItemLayout}
                label="FIPS-Name"
                validateStatus={this.state.patternLengthValidStatus}
                help={this.state.patternLengthErrorMsg}
              >
                <Select style={{ width: '50%' }} defaultValue="" options={this.props.home.searchFields.fipsName} />
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
                  defaultValue=""
                  options={this.props.home.searchFields.climateChangeImpactCategories}
                />
              </Form.Item>
              <Form.Item {...formItemLayout} help={this.state.patternNumberErrorMsg}>
                <Slider
                  min={0}
                  max={50}
                  onChange={r => {
                    this.setState({ individualIncome: r.value });
                  }}
                  value={this.state.individualIncome}
                />
              </Form.Item>
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