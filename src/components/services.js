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
    return asciiString.substr(0,asciiString.indexOf("\0")); // name is right-padded with null bytes
  }

  getServiceRegistrations(registry) {
    return registry.listOrganizations()
      .then(({ orgNames }) =>
        Promise.all(orgNames.map(orgName => Promise.all([ Promise.resolve(orgName), registry.listServicesForOrganization(orgName) ])))
      )
      .then(servicesByOrg => {
        const nonEmptyServiceLists = servicesByOrg.filter(([ , { serviceNames } ]) => serviceNames.length);
        return Promise.all(
          nonEmptyServiceLists.reduce((acc, [ orgName, { serviceNames } ]) =>
            acc.concat(serviceNames.map(serviceName => Promise.all([
              Promise.resolve(orgName),
              registry.getServiceRegistrationByName(orgName, serviceName)
            ])))
          , [])
        );
      })
      .then(servicesList =>
        Promise.resolve(servicesList.map(([ orgName, { name, agentAddress, servicePath } ]) => ({ orgName, name, agentAddress, servicePath })))
      )
      .catch(console.error);
  };

  watchRegistries() {
    if(typeof this.props.registries !== "undefined" && this.props.agentContract) {
      Promise.all([
        typeof this.props.registries["AlphaRegistry"] !== "undefined" ? this.props.registries["AlphaRegistry"].listRecords() : undefined,
        typeof this.props.registries["Registry"] !== "undefined" ? this.getServiceRegistrations(this.props.registries["Registry"]) : undefined
      ])
      .then(([ alphaRegistryListing, registryListing ]) => {
        let agents = [];

        if (typeof alphaRegistryListing !== "undefined") {  
          alphaRegistryListing[0].map((input, index) => {
            const asciiName = this.hexToAscii(input);

            const thisAgent = {
              "name": asciiName,
              "address": alphaRegistryListing[1][index],
              "key": [ alphaRegistryListing[1][index], asciiName ].filter(Boolean).join("/"),
            };

            if (thisAgent.name !== "" && thisAgent.address !== STRINGS.NULL_ADDRESS) {
              agents.push(thisAgent);
            }
          });
        }

        if (typeof registryListing !== "undefined") {
          registryListing.forEach(({ orgName, name, agentAddress, servicePath }) => {
            const serviceAsciiName = this.hexToAscii(name);
            const serviceAsciiPath = this.hexToAscii(servicePath);
            const orgAsciiName = this.hexToAscii(orgName);

            const serviceIdentifier = [ orgAsciiName, serviceAsciiPath, serviceAsciiName ].filter(Boolean).join("/");
            
            const thisAgent = {
              "name": serviceIdentifier,
              "address": agentAddress,
              "key": [ agentAddress, serviceIdentifier ].filter(Boolean).join("/")
            };

            if (thisAgent.name !== "" && thisAgent.address !== STRINGS.NULL_ADDRESS) {
              agents.push(thisAgent);
            }
          });
        }

        let promises = [];
        
        if (this.state.featured.length < 1) {
          promises.push(fetch('/featured.json')
            .then(response => response.json())
            .then(response => {
              this.setState({ "featured": response })
              return Promise.resolve(response)
            })
          )
        } else promises.push(Promise.resolve(this.state.featured))

        for(let agent in agents) {
          let agentInstance = this.props.agentContract.at(agents[agent].address);
          agents[agent]['contractInstance'] = agentInstance;

          let statePromise    = agentInstance.state();
          let pricePromise    = agentInstance.currentPrice();
          let endpointPromise = agentInstance.endpoi