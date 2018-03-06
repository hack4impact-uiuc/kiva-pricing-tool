import React, { Component } from 'react'	
import PropTypes from 'prop-types'
import Bootstrap from 'react-bootstrap'

class TextField extends Component {
	constructor(props) {
		super(props);
		this.state = {valid: true, id: this.props.text, error_message: "", type: this.props.typeVal};
	}

  handleChange(e) {
	var value = e.target.value;
	var input = value.split('');
	var foundError = false;
	  
	  if (this.props.typeVal == "String" || this.props.typeVal == "string") {
		if (value.length <= this.props.limit) {
			for (var i = 0; i < input.length; i++) {
			  if (!isNaN(input[i]) && input[i] != " ") {
				  foundError = true;
			  }else{
				  this.setState({error_message: ""});
			  }
			}
			if (foundError) {
				this.setState({error_message: "error in input: should be a word"});
			}
		}else{
			this.setState({error_message: "error in input"});
		}
	  }
	  
	  if (this.props.typeVal == "Int" || this.props.typeVal == "int") {
		if (value <= this.props.limit) {
			for (var i = 0; i < input.length; i++) {
				if (isNaN(input[i])) {
					foundError = true;
				}else{
					this.setState({error_message: ""});
				}
			}
			if (foundError) {
			  this.setState({error_message: "error in input: should be a number"});
			}
		}else{
			this.setState({error_message: "error in input"});
		}
	  }	  
	  
	  if (this.props.typeVal == "Float" || this.props.typeVal == "float") {
		if (value <= this.props.limit) {
			for (var i = 0; i < input.length; i++) {
				if (isNaN(input[i]) && input[i] != ".") {
					 foundError = true;
				}else{
					this.setState({error_message: ""});
				}
			}
			
			if (value.includes(".") === false) {
				foundError = true;
			}
			
			if (foundError) {
				this.setState({error_message: "error in input: should be a decimal number"});
			}
		}else{
			this.setState({error_message: "error in input"});
		}
	  }
	  
	if (input == "") {
		this.setState({error_message: ""});
	}
	
   }
  
  render() {
	if (!this.state.valid) {
		var error = this.state.error_message;
	}
    return (
      <div id = "className">
	<input class="form-control input-sm" type={this.props.input_type} id={this.props.text}
                    placeholder={this.props.hint} onChange={(event) => this.handleChange(event)} required autofocus /> <br/>
	<p>{this.state.error_message}</p>
      </div>
	)
  }
}
export default TextField
