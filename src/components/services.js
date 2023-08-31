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
            <a target="_blank" href={this.props.network && typeof NETWORKS[this.props.network] !== "undefined" ? `${NETWORKS[this.props.network].etherscan}/address/${address}` : undefined}>
              {FORMAT_UTILS.toHumanFriendlyAddressPreview(address)}
            </a>
          </Tag>
      },
      {
        title:      'Current Price',
        dataIndex:  'currentPrice',
        render:     (currentPrice, agent, index) => `${AGI.toDecimal(currentPrice)} AGI`,
      },
      {
        title:      'Agent Endpoint',
        dataIndex:  'endpoint',
        width: '23ch'
      },
      {
        title:      '',
        dataIndex:  'state',
        render:     (state, agent, index) =>
          <Button type={state == AGENT_STATE.ENABLED ? 'primary' : 'danger'} disabled={ !(state == AGENT_STATE.ENABLED) || typeof this.props.account === 'undefined' || typeof this.state.selectedAgent !== 'undefined' } onClick={() => { this.setState({ selectedAgent: agent }); return this.props.onAgentClick(agent); }} >
            { this.getAgentButtonText(state, agent) }
          </Button>
        }
    ].map(column => Object.assign({}, { width: 150 }, column));

    this.watchRegistriesTimer = undefined;
  }

  getAgentButtonText(state, agent) {
    if (this.props.account) {
      if (typeof this.state.selectedAgent === 'undefined' || this.state.selectedAgent.key !== agent.key) {
        return state == AGENT_STATE.ENABLED ? 'Create Job' : 'Agent Disabled';
      } else {
        return 'Selected';
      }
    } else {
      return 'Unlock account';
    }
  }

  componentWillMount() {
    this.watchRegistriesTimer = setInterval(() => this.watchRegistries(), 500);
  }

  componentWillUnmount() {
    clearInterval(this.watchRegistriesTimer);
  }

  hexToAscii(hexString) { 
    let asciiString = Eth.toAscii(hexString);
    return asciiString.substr(0,asciiString.indexOf("\0")); 