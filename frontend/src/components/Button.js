import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import { withRouter } from 'react-router-dom'
import './../styles/button.scss'
// import './../styles/instructions.css'
class Button extends Component {
  render() {
    return (
      <Route
        render={({ history }) => (
          <button
            className="button"
            type="button"
            // disabled={this.props.disable ? this.props.disable : false}
            onClick={() => {
              this.props.onClickHandler()
              var runnable =
                this.props.disable == null ? true : !this.props.disable
              runnable && history.push('/' + this.props.url)
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
