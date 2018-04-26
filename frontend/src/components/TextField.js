import React, { Component } from 'react'
import './../styles/textfield.css'

class TextField extends Component {
  constructor(props) {
    super(props)
    const { formDataReducer } = this.props
    this.state = {
      valid: true,
      id: this.props.text,
      error_message: '',
      type: this.props.typeVal
    }
  }

  handleChange(e) {
    const { formDataReducer, changedFormData } = this.props
    let value = e.target.value

    if (this.props.typeVal.toLowerCase() === 'int') {
      let tryInt = parseInt(value, 10)
      let limit = parseInt(this.props.limit, 10)
      if (isNaN(tryInt)) {
        this.setState({ error_message: 'Error in input: should be an integer' })
      } else {
        if (tryInt > limit) {
          this.setState({ error_message: 'input limit succeeded' })
        } else {
          this.setState({ error_message: '' })
        }
      }
    }

    if (this.props.typeVal.toLowerCase() === 'float') {
      let tryFloat = parseFloat(value)
      let limit = parseInt(this.props.limit, 10)
      if (isNaN(tryFloat)) {
        this.setState({ error_message: 'Error in input: should be a decimal' })
      } else {
        if (tryFloat > limit) {
          this.setState({ error_message: 'input limit succeeded' })
        } else {
          this.setState({ error_message: '' })
        }
      }
    }

    if (this.props.typeVal.toLowerCase() === 'string') {
      let tryString = /^[a-zA-Z ]+$/.test(value)
      if (!tryString) {
        this.setState({
          error_message: 'Error in input: should only have letters'
        })
      } else {
        this.setState({ error_message: '' })
      }
    }
    if (value === '') {
      this.setState({ error_message: '' })
    }
    this.setState({ textBody: value })
    changedFormData(this.props.reduxId, value)
  }

  render() {
    if (!this.state.valid) {
      let error = this.state.error_message
    }
    return (
      <div id="className" className={this.props.className}>
        <div className="input-label">{this.props.id}</div>
        <input
          className="textfield-component form-control input-sm"
          type={this.props.input_type}
          id={this.props.text}
          placeholder={this.props.hint}
          onChange={event => this.handleChange(event)}
          value={this.props.textBody === null ? '' : this.props.textBody}
          required
          // autofocus
        />
        <p className="error-message">{this.state.error_message}</p>
      </div>
    )
    // return (
    //   <div id="className" className={this.props.className}>
    //     <div className="input-label">{this.props.id}</div>
    //     <div className="textfield-component">
    //       <input
    //         className="form-control input-sm"
    //         type={this.props.input_type}
    //         id={this.props.text}
    //         placeholder={this.props.hint}
    //         onChange={event => this.handleChange(event)}
    //         value={this.state.textBody}
    //         required
    //         autoFocus
    //       />
    //     </div>
    //     <p className="error-message">{this.state.error_message}</p>
    //   </div>
    // )
  }
}
export default TextField
