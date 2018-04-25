import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import './../styles/button.css'
class Button extends Component {
  render() {
    return (
      <Route
        render={({ history }) => (
          <button
            className={this.props.className}
            type="button"
            onClick={() => {
              let runnable =
                this.props.disable === null ? true : !this.props.disable
              if (runnable) {
                if (this.props.onClickHandler) this.props.onClickHandler()
                history.push('/' + this.props.url)
              }
            }}
          >
            {this.props.name}
          </button>
        )}
      />
    )
  }
}

export default Button
