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
		this.state = {valid: true, id: this.props.text, error_message: ""};
	}

  handleChange(event) {
	  var input = document.getElementById(this.state.id).innerHTML;
	  if (!isNaN(input)) {
	  this.setState({error_message: "error in input"});
	  } 
  }
  
  render() {
	if (!this.state.valid) {
		var error = this.props.error_message;
	}
    return (
      <div id = "className">
		<input class="form-control input-sm" type={this.props.input_type} id={this.props.text} placeholder={this.props.hint} onChange={this.handleChange.bind(this)} required autofocus /> <br/>
		<p>{this.state.error_message}</p>
	</div>
	)
  }
}
export default TextField
