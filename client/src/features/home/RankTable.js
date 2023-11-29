import React, { useEffect, useState, useCallback } from 'react';
// import PropTypes from 'prop-types';
import {} from './redux/hooks';
import { Space, Table, Tag } from 'antd';

export default function RankTable({data}) {
  const columns = data? Object.keys(data[0]).map((v)=>{
    return {
      title: v,
      dataIndex: v,
      key: v,
    }
  }): null
  return (
    <div>
      <Table columns={columns} dataSource={data}></Table>
    </div>
  );
};

RankTable.propTypes = {};
RankTable.defaultProps = {};
