import React, { Component } from 'react'
import { connect } from 'react-redux'
import './../styles/textfield.css'

class TextField extends Component {
  constructor(props) {
    super(props)
    const { formDataReducer } = this.props
    this.state = {
      id: this.props.text,
      error_message: '',
      type: this.props.typeVal,
      className: this.props.className // Allows for adding and deleting classnames - conditional styling with external css
    }
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.formDataReducer[this.props.reduxId] !=
      this.props.formDataReducer[this.props.reduxId]
    ) {
      this.setState({
        error_message: '',
        className: this.props.className
      })
    }
  }

  componentDidMount() {
    // Used to check required fields and highlight with error messages immediately
    const { formDataReducer, changedFormData } = this.props
    if (
      this.props.requiredField &&
      (!formDataReducer[this.props.reduxId] ||
        formDataReducer[this.props.reduxId].length === 0)
    ) {
      this.setState({
        error_message: 'This field is required.',
        className: this.props.className + ' required-error'
      })
      changedFormData('error', true)
    } else {
      this.setState({
        error_message: '',
        className: this.props.className
      })
      changedFormData('error', false)
    }
  }

  handleChange(e) {
    this.setState({ className: this.props.className }) // Reset classname before checks, especially for required fields (removes required-error className)
    const { formDataReducer, changedFormData } = this.props
    let value = e.target.value

    if (this.props.typeVal.toLowerCase() === 'int') {
      let tryInt = parseInt(value, 10)
      let limit = parseInt(this.props.limit, 10)
      if (isNaN(tryInt)) {
        this.setState({
          error_message: 'Error in input: should be an integer',
          className: this.props.className + ' required-error'
        })
        changedFormData('error', true)
      } else {
        if (tryInt > limit) {
          this.setState({
            error_message: 'input limit succeeded',
            className: this.props.className + ' required-error'
          })
          changedFormData('error', true)
        } else {
          this.setState({ error_message: '' })
          changedFormData('error', false)
        }
      }
    }

    if (this.props.typeVal.toLowerCase() === 'float') {
      let tryFloat = parseFloat(value)
      // console.log(value.matches("[0-9.]*"))
      console.log(/^[a-zA-Z ]+$/.test(value))
      let limit = parseInt(this.props.limit, 10)
      console.log(tryFloat)
      if (isNaN(tryFloat)) {
        this.setState({
          error_message: 'Error in input: should be a decimal',
          className: this.props.className + ' required-error'
        })
        changedFormData('error', true)
      } else {
        if (tryFloat > limit) {
          this.setState({
            error_message: 'input limit succeeded',
            className: this.props.className + ' required-error'
          })
          changedFormData('error', true)
        } else {
          this.setState({ error_message: '' })
          changedFormData('error', false)
        }
      }
    }

    if (this.props.typeVal.toLowerCase() === 'string') {
      let tryString = /^[a-zA-Z ]+$/.test(value)
      if (!tryString) {
        this.setState({
          error_message: 'Error in input: should only have letters',
          className: this.props.className + ' required-error'
        })
        changedFormData('error', true)
      } else {
        this.setState({ error_message: '' })
        changedFormData('error', false)
      }
    }

    if (
      value === '' &&
      formDataReducer[this.props.reduxId].length === 0 &&
      this.props.requiredField === true
    ) {
      // Check if required field is empty
      this.setState({
        error_message: 'This field is required.',
        className: this.props.className + ' required-error'
      })
      changedFormData('error', true)
    } else if (value === '') {
      // Else if to prevent error message resetting (both conditions check for value)
      this.setState({ error_message: '', className: this.props.className }) // Reset classname since it's not an error (remove required-error)
      changedFormData('error', false)
    }

    changedFormData(this.props.reduxId, value)
  }

  render() {
    const { formDataReducer } = this.props
    console.log('¯\\_(ツ)_/¯', this.state.className)
    return (
      <div id="className" className={this.state.className}>
        <div className="input-label">{this.props.id}</div>
        <div className="textfield-component" onLoad={() => this.onLoad()}>
          <input
            className="form-control input-sm"
            type={this.props.input_type}
            id={this.props.text}
            placeholder={this.props.hint}
            onChange={event => this.handleChange(event)}
            value={formDataReducer[this.props.reduxId]}
            required
            autofocus
          />
        </div>
        <p className="error-message">{this.state.error_message}</p>
      </div>
    )
  }
}
export default TextField
