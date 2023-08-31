import React from 'react';
import {Layout, Divider, Card, Icon, Spin, Alert, Row, Col, Button, Tag, message, Table, Collapse, Steps, Modal, Upload} from 'antd';
import styles from './face_detect.css.js';

class FaceDetectService extends React.Component {

  constructor(props) {
    super(props);

    this.submitAction = this.submitAction.bind(this);
    this.state = {
        fileUploaded: false,
        file: undefined,
        fileReader: undefined,
        methodName: "find_face",
    };
  }

  isComplete() {
    if (this.props.jobResult === undefined)
        return false;
    else {
        console.log(this.props.jobResult);
        return true;
    }
  }
  
  processFile(file) {
    let reader = new FileReader();

    reader.onload = (e => {
      this.setState({
        fileUploaded: true,
        file: 