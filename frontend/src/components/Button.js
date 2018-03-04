import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import { withRouter } from 'react-router-dom'
import './../styles/button.css'
// import './../styles/instructions.css'
class Button extends Component {
  render() {
    return (
      <Route
        render={({ history }) => (
          <button
            className="button"
            type="button"
            onClick={() => {
              history.push('/' + this.props.url)
            }}
            disabled={this.props.disable}
          >
            {this.props.name}
          </button>
        )}
      />
    )
  }
}

export default Button
