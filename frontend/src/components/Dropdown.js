import React, { Component } from 'react'
import { connect } from 'react-redux'
import { DropdownButton, MenuItem } from 'react-bootstrap'
import './../styles/dropdown.css'

class Dropdown extends Component {
  // Dropdown title

  constructor(props) {
    super(props)
    const { formDataReducer } = this.props
    // console.log(formDataReducer[this.props.reduxId], formDataReducer[this.props.reduxId].length)
    this.state = {
      default: this.props.title,
      value: this.props.title, // Used to check if value of dropdown is the same as the title for error messages
      className: this.props.className,
      error_message: '',
      error_class: '' // Used to check if error message exists to conditionally assign class to error message element
    }
  }

  // Dropdown menu options
  dropdownItems = this.props.items

  componentDidMount() {
    const { formDataReducer } = this.props
    // console.log('hi')
    let val = this.props.reduxId
    // console.log(formDataReducer)
    // console.log( val, formDataReducer.this.props.reduxId)
    this.setState({
      value:
        formDataReducer[this.props.reduxId].length === 0
          ? this.props.title
          : formDataReducer[this.props.reduxId]
    })

    // If value is the same as the title, mark as required
    if (
      this.props.requiredField === true &&
      this.state.value === this.state.default
    ) {
      this.setState({
        className: this.props.className + ' required-dropdown',
        error_message: 'This field is required.'
      })
    } else {
      this.setState({ className: this.props.className, error_message: '' })
    }

    // Check class to assign to error for styling
    if (this.state.error_message.length !== 0) {
      this.setState({ error_class: 'error-message' })
    } else {
      this.setState({ error_class: 'hidden-error' })
    }
  }

  render() {
    const { formDataReducer, changedFormData } = this.props
    // console.log("yo", formDataReducer, this.props.reduxId, "hi"+formDataReducer[this.props.reduxId])
    // console.log(this.state.value)
    return (
      <span className="space">
        <DropdownButton
          title={
            formDataReducer[this.props.reduxId].length === 0
              ? this.state.value
              : formDataReducer[this.props.reduxId]
          }
          id="dropdown-menu"
          className={this.state.className}
        >
          {this.dropdownItems.map(item => (
            <MenuItem
              key={item.id}
              // Get value of selected item, change state and update title
              onSelect={() => {
                // if (this.props.onTextInputChange)
                // this.props.onTextInputChange(this.props.reduxId, item.value)
                changedFormData(this.props.reduxId, item.value)
                this.setState({ value: item.value })
                if (item.value !== this.state.default) {
                  // Update state if value doesn't match the title
                  this.setState({
                    className: this.props.className,
                    error_message: '',
                    error_class: 'hidden-error'
                  })
                }
              }}
            >
              {item.value}
            </MenuItem>
          ))}
        </DropdownButton>
        <p className="error-message">{this.state.error_message}</p>
      </span>
    )
  }
}

export default Dropdown
