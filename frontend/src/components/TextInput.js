// @flow
import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import { withRouter } from 'react-router-dom'
import {
  Form,
  Grid,
  Col,
  Jumbotron,
  PageHeader,
  FormGroup,
  ControlLabel,
  FormControl,
  HelpBlock
} from 'react-bootstrap'
//import Bootstrap from 'react-bootstrap'
import './../styles/text-input.css'

class TextInput extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: ''
    }

    this.handleInputChange = this.handleInputChange.bind(this)
  }

  handleInputChange(event) {
    const target = event.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.name

    this.setState({
      [name]: value
    })
  }

  render() {
    return (
      <span className="space">
        <FormGroup controlId="formBasicText">
          <ControlLabel>{this.props.title}</ControlLabel>
          <span className="space">
            <FormControl
              type="text"
              value={this.state.value}
              placeholder={this.props.info}
              onChange={this.handleChange}
              bsSize="small"
            />
          </span>
          <FormControl.Feedback />
        </FormGroup>
      </span>
    )
  }
}

export default TextInput
