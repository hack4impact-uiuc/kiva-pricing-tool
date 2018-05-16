import React, { Component } from 'react'
import './../styles/textfield.css'

class TextField extends Component {
  constructor(props) {
    super(props)
    this.state = {
      id: this.props.text,
      error_message: '',
      type: this.props.typeVal,
      className: this.props.className // Allows for adding and deleting classnames - conditional styling with external css
    }
  }

  // if redux populates fields, will remove the "field required" error message
  componentWillReceiveProps(nextProps) {
    if (
      nextProps.formDataReducer[this.props.reduxId] !==
        this.props.formDataReducer[this.props.reduxId] &&
      (!this.props.formDataReducer[this.props.reduxId] ||
        this.props.formDataReducer[this.props.reduxId].length === 0)
    ) {
      let newData = nextProps.formDataReducer
      if (
        !newData[this.props.reduxId] ||
        newData[this.props.reduxId].length === 0
      ) {
        this.setState({
          error_message: 'This field is required.',
          className: this.props.className + ' required-error'
        })
      } else {
        this.setState({
          error_message: '',
          className: this.props.className
        })
      }
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

  handleChangeInteger(e) {
    const { changedFormData } = this.props
    const nums = /^[0-9\b]+$/

    if (nums.test(e.target.value)) {
      let tryInt = parseInt(e.target.value, 10)
      let limit = parseInt(this.props.limit, 10)
      if (tryInt > limit) {
        this.setState({
          error_message: 'input limit succeeded',
          className: this.props.className + ' required-error'
        })
        changedFormData('error', true)
      } else {
        this.setState({ error_message: '' })
        changedFormData('error', true)
      }

      changedFormData(this.props.reduxId, e.target.value)
    }
  }

  handleChangeFloat(e) {
    const { changedFormData } = this.props
    const nums = /^[0-9\b]+$/
    const numPeriods = e.target.value.split('.')

    if (
      e.target.value === '' ||
      (numPeriods.length <= 2 && nums.test(e.target.value.replace('.', '')))
    ) {
      let tryFloat = parseFloat(e.target.value)
      let limit = parseInt(this.props.limit, 10)

      if (tryFloat > limit) {
        this.setState({
          error_message: 'input limit succeeded',
          className: this.props.className + ' required-error'
        })
        changedFormData('error', true)
      } else {
        this.setState({ error_message: '' })
        changedFormData('error', true)
      }
      changedFormData(this.props.reduxId, e.target.value)
    }
  }

  handleChangeString(e) {
    const { changedFormData } = this.props
    changedFormData(this.props.reduxId, e.target.value)
    let tryString = /^[a-zA-Z ]+$/.test(e.target.value)
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

  handleChange(e) {
    this.setState({ className: this.props.className }) // Reset classname before checks, especially for required fields (removes required-error className)
    const { changedFormData } = this.props
    let value = e.target.value

    if (this.props.typeVal.toLowerCase() === 'int') {
      this.handleChangeInteger(e)
    }

    if (this.props.typeVal.toLowerCase() === 'float') {
      this.handleChangeFloat(e)
    }

    if (this.props.typeVal.toLowerCase() === 'string') {
      this.handleChangeString(e)
    }

    if (
      value.replace(/\s/g, '').length === 0 &&
      // formDataReducer[this.props.reduxId].length === 0 &&
      this.props.requiredField === true
    ) {
      // Check if required field is empty
      this.setState({
        error_message: 'This field is required.',
        className: this.props.className + ' required-error'
      })
      changedFormData('error', true)
      changedFormData(this.props.reduxId, value)
    }
  }

  render() {
    const { formDataReducer } = this.props
    return (
      <div className={this.state.className}>
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
            autoFocus
          />
        </div>
        <p className="error-message">{this.state.error_message}</p>
      </div>
    )
  }
}
export default TextField
