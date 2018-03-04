// @flow
import React, { Component } from 'react'
import {
  Form,
  Grid,
  Jumbotron,
  PageHeader,
  FormGroup,
  ControlLabel,
  FormControl,
  HelpBlock
} from 'react-bootstrap'
//import Bootstrap from 'react-bootstrap'
import './../styles/app.css'

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
      <FormGroup controlId="formBasicText">
        <ControlLabel>{this.props.title}</ControlLabel>
        <FormControl
          type="text"
          value={this.state.value}
          placeholder={this.props.info}
          onChange={this.handleChange}
          bsSize="small"
        />
        {'  '}
        <FormControl.Feedback />
      </FormGroup>
    )
  }
}

export default TextInput
