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
      error_class: '' // Used to check if error message exists to conditionally assign class to error message element
    }
  }

  // Dropdown menu options
  dropdownItems = this.props.items

  // if redux populates fields, will remove the "field required" error message
  componentWillReceiveProps(nextProps) {
    if (
      nextProps.formDataReducer[this.props.reduxId] !=
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
          className: this.props.className + ' required-dropdown',
          error_class: 'error-message'
        })
      } else {
        this.setState({
          className: this.props.className,
          error_class: 'hidden-error'
        })
      }
    }
  }

  componentDidMount() {
    const { formDataReducer } = this.props
    let val = this.props.reduxId
    this.setState({
      value:
        formDataReducer[this.props.reduxId].length === 0
          ? this.props.default
          : formDataReducer[this.props.reduxId]
    })

    // If value is the same as the title, mark as required
    if (
      this.props.requiredField === true &&
      this.state.value === this.state.default
    ) {
      this.setState({
        className: this.props.className + ' required-dropdown',
        error_class: 'error-message'
      })
    } else {
      this.setState({
        className: this.props.className,
        error_class: 'hidden-error'
      })
    }
  }

  render() {
    const { formDataReducer, changedFormData } = this.props
    return (
      <span className="space">
        <DropdownButton
          title={
            formDataReducer[this.props.reduxId].length === 0
              ? this.state.default
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
                    error_class: 'hidden-error'
                  })
                }
              }}
            >
              {item.value}
            </MenuItem>
          ))}
        </DropdownButton>
        <p className={this.state.error_class}>This field is required.</p>
      </span>
    )
  }
}

export default Dropdown
