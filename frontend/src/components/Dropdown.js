import React, { Component } from 'react'
import { DropdownButton, MenuItem } from 'react-bootstrap'
import './../styles/app.css'

class Dropdown extends Component {
  // Dropdown title
  state = {
    value: this.props.title
  }

  // Dropdown menu options
  dropdownItems = this.props.items

  render() {
    return (
      <DropdownButton title={this.state.value} id="dropdown-menu">
        {this.dropdownItems.map(item => (
          <MenuItem
            key={item.id}
            // Get value of selected item, change state and update title
            onSelect={() => this.setState({ value: item.value })}
          >
            {item.value}
          </MenuItem>
        ))}
      </DropdownButton>
    )
  }
}

export default Dropdown
