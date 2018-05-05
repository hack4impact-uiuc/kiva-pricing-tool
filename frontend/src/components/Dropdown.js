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
      default: this.props.title
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
        >
          {this.dropdownItems.map(item => (
            <MenuItem
              key={item.id}
              // Get value of selected item, change state and update title
              onSelect={() => {
                // if (this.props.onTextInputChange)
                // this.props.onTextInputChange(this.props.reduxId, item.value)
                changedFormData(this.props.reduxId, item.value)
                // this.setState({ value: item.value })
              }}
            >
              {item.value}
            </MenuItem>
          ))}
        </DropdownButton>
      </span>
    )
  }
}

export default Dropdown
