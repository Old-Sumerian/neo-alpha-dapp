import React from 'react';
import {Layout, Divider, Card, Icon, Spin, Alert, Row, Col, Button, Tag, message, Table, Collapse, Steps, Modal, Upload} from 'antd';
import { debounce } from 'underscore';


class DefaultService extends React.Component {

  constructor(props) {
    super(props);

    this.submitAction = this.submitAction.bind(this);
    this.updateValid = this.updateValid.bind(this);
    this.updateValid = debounce(this.updateValid, 500);
    
    this.state = {
        serviceName: "test",
        methodName: "test",
        paramString: "{}",
        inputValid: true
    };
  }

  isComplete() {
    if (this.props.jobResult === undefined)
        return false;
    e