import React, { Component } from 'react'
import 'react-bootstrap-typeahead/css/Typeahead.css'
import Bootstrap, { Button } from 'react-bootstrap'
import TextField from './TextField'
import axios from 'axios'
import 'jquery'
import {Typeahead} from 'react-bootstrap-typeahead'

class NewLoan extends Component {
	constructor(props) {
		super(props);
		this.state = {error_message: "", multiple: false, value: ""};
		var Typeahead = require('react-bootstrap-typeahead').Typeahead;
	}
	
	render() {
		return (
		<div>
		<Typeahead
			labelKey={this.props.label}
			multiple=""
			options={this.props.list}
			placeholder ={this.props.hint}
			onChange={(e) => console.log(this.props.list[2])}
		/>
		<br>
		</br>
		</div>
		)
	}
}
export default NewLoan
