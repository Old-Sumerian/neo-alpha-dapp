import React from 'react';
import { Input, Button } from 'antd';
import { isValidAddress } from '../../util';

class ExchangeService extends React.Component {

  constructor(props) {
    super(props);

    this.submitAction = this.submitAction.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.updateValid = this.updateValid.bind(this);

    this.state = {
      methodName: 'agibtc',
      response: null,
      address: ""
    };

  }

  submitAction() {
    const { address, methodName } = this.state;

    this.props.showModalCallback(this.props.callModal);
    this.props.callApiCallback(methodName, { address });
  }

  componentWillReceiveProps(nextProps) {
    console.log("Receiving props: ", nextProps);

    i