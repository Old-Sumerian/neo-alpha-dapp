import React from 'react';
import {Layout, Divider, Card, Icon, Spin, Alert, Row, Col, Button, Tag, message, Table, Collapse, Steps, Modal, Upload} from 'antd';
import { debounce } from 'underscore';

class FaceAlignmentService extends React.Component {

  constructor(props) {
    super(props);

    this.submitAction = this.submitAction.bind(this);
    this.updateValid = this.updateValid.bind(this);
    this.updateValid = debounce(this.updateValid, 500);

    this.state = {
        fileUploaded: false,
        file: undefined,
        fileReader: undefined,
        methodName: "align_face",
        facesString: '[{"x":10,"y":10,"w":100,"h":100}]',
        inputValid: true,
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

  updateValid() {
    let inputValid = true;
    
    try {
        let faces = JSON.parse(this.state.facesString);
        faces.forEach((item) => {
          let expectedKeys = ['x', 'y', 'w', 'h'];
          expectedKeys.forEach((k) => {
            if (!(k in item)) inputValid = false;
          });
        });
    } catch(e) {
        inputValid = false;
    }
    
    if (this.state.methodName.length == 0)
        inputValid = false;

    if (!this.state.fileUploaded)
        inputValid = false;

    this.setState({
        inputValid: inputValid
    });
  }
  
  handleChange(type, e) {
    this.setState({
        [type]: e.target.value,
    });
    this.updateValid();
  }
  
  processFile(file) {
    let reader = new FileReader();

    reader.onload = (e => {
      this.setState({
        fileUploaded: true,
        file: file,
        fileReader: reader,
      });
    });

    reader.readAsDataURL(file);
    this.updateValid();
  }

  submi