import React, { Component } from 'react'
import './../styles/large-text-input.css'

class LargeTextInput extends Component {
  render() {
    return (
      <div className="large-text-input-container">
        <span
          title="My tip"
          className="large-text-input"
          contenteditable="true"
        />
      </div>
    )
  }
}

export default LargeTextInput
