import React, { Component } from 'react'
import './../styles/app.css'

class TextComponent extends Component {
  constructor(props) {
    super(props)
    this.classes = 'app-text ' + props.className
  }

  render() {
    return (
      <span className={this.classes}>{this.props.children}</span>
      // style={this.buildStyle(this.props)}
    )
  }
}

export default TextComponent
