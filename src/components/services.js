import React from 'react';
import Eth from 'ethjs';
import {Layout, Divider, Card, Icon, Spin, Alert, Row, Col, Button, Tag, message, Table} from 'antd';
import {NETWORKS, AGENT_STATE, AGI, FORMAT_UTILS, STRINGS} from '../util';


class Services extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      agents : [],
      featured: [],
      selectedAgent: undefined,
    };

    this.servicesTableKeys = [
      {
        title:      'Agent',
        dataIndex:  'name',
        width:      200,
      },
      {
        title:      'Contract Address',
        dataIndex:  'address',
        width:      '20ch',
        render:     (address, agent, index) =>
          this.props.network &&
          <Tag>
            <a target="_b