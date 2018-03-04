import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Bootstrap from 'react-bootstrap'

class TextField extends Component {
  /*
	//propTypes returns syntax error for me but it might work on other machine
	static PropTypes = {
        text = PropTypes.string,
        hint = PropTypes.string,
        error_message = PropTypes.string,
        input_type = PropTypes.string
    }
	*/
  state = {
    valid: true
  }
  handleChange(event) {
	  //var input = document.getElementById(this.props.text);
	  var input = 3;
	  if (typeof input == 'number') {
		  var error = "not accurate type";
	  }
  }
  
  render() {
	 if (!this.state.valid) {
		var error = this.props.error_message;
	 }
    return (
      <div>
					<input class="form-control input-sm" type={this.props.input_type} id={this.props.text}
                    placeholder={this.props.hint} onChange={this.handleChange} required autofocus /> <br/>
					<p>{error}</p>
	   </div>
	)
  }
}
export default TextField


