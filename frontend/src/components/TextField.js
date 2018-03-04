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
	constructor(props) {
		super(props);
		this.state = {valid: true};
	}

  handleChange(input, event) {
	  var error = "not accurate type";
	  if (!isNaN(input)) {
		  return error;
	  }else{
		  return null;
	  }
  }
  
  render() {
	 if (!this.state.valid) {
		var error = this.props.error_message;
	 }
    return (
      <div id = "className">
					<input class="form-control input-sm" type={this.props.input_type} id={this.props.text}
                    placeholder={this.props.hint} onChange={(e) => this.handleChange(document.getElementById(this.props.text), e)} required autofocus /> <br/>
					<p>{this.state.error_message}</p>
	   </div>
	)
  }
}
export default TextField
