import React, { Component } from 'react'
import { DropdownButton, MenuItem } from 'react-bootstrap'
import './../styles/dropdown.css'

class Dropdown extends Component {
  // Dropdown title
  state = {
    value: this.props.selected ? this.props.selected : this.props.title
  }

  // Dropdown menu options
  dropdownItems = this.props.items

  render() {
    return (
      <span className="space">
        <DropdownButton title={this.state.value} id="dropdown-menu">
          {this.dropdownItems.map(item => (
            <MenuItem
              key={item.id}
              // Get value of selected item, change state and update title
              onSelect={() => {
                if (this.props.onTextInputChange)
                  this.props.onTextInputChange(this.props.reduxId, item.value)
                this.setState({ value: item.value })
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
