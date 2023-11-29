import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import { Layout, Menu, PageHeader} from 'antd';
import {Link} from 'react-router-dom'
import {
  DesktopOutlined,
  PieChartOutlined,
} from '@ant-design/icons';
import '../../styles/HomeLayout.less';

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

export class HomeLayout extends Component {
  static propTypes = {
    home: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

   state = {
    collapsed: false,
  };

  onCollapse = collapsed => {
    console.log(collapsed);
    this.setState({ collapsed });
  };

  render() {
    const { collapsed } = this.state;
    const {title, subtitle} = this.props.home.layoutHeader;
    return (
      <div className="home-spine-layout">
        <Layout style={{ minHeight: '100vh' }}>
          <Sider collapsible collapsed={collapsed} onCollapse={this.onCollapse}>
            <div className="logo" />
            <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
              <Menu.Item key="climateRisk" icon={<PieChartOutlined />}>
                <Link to="/climate_risk">Community Resilence Search Tool</Link>
              </Menu.Item>
              <Menu.Item key="censusTractFilter" icon={<DesktopOutlined />}>
                <Link to="/census_tract_filter">Census Tract Filter</Link>
              </Menu.Item>
              <Menu.Item key="censusTractRank" icon={<DesktopOutlined />}>
                <Link to="/census_tract_rank">Census Tract Rank</Link>
              </Menu.Item>
              <Menu.Item key="climateResilienceScore" icon={<DesktopOutlined />}>
                <Link to="/climate_resilience_score">Climate Resilience Score</Link>
              </Menu.Item>
            </Menu>
          </Sider>
          <Layout className="site-layout">
            <Header className="site-layout-background" style={{ height: "60px" }}>
              <PageHeader
                className="site-page-header"
                title={title}
                subTitle={subtitle}
              />
            </Header>
            <Content style={{ margin: '0 16px' }}>
              {this.props.children}
            </Content>
            <Footer style={{ textAlign: 'center' }}>Upenn 5500</Footer>
          </Layout>
        </Layout>
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
)(HomeLayout);
