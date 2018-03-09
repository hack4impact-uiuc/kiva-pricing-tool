import React, { Component } from 'react'
import Bootstrap from 'react-bootstrap'
import TextField from './TextField'

class NewLoan extends Component {
	constructor(props) {
		super(props);
		this.state = {mfiBool: false, loanBool: false, productBool: false, errorMessage: ""};
	}
	
	changeMFI(e) {
		this.state.mfiBool = true;
	}
	
	changeLoan(e) {
		this.state.loanBool = true;
	}
	
	changeProduct(e) {
		this.state.productBool = true;
	}
	
	render() {

		return (
		// onClick={ (event) => {this.changeMFI(event);}} 
		<div>
			<select class="mfiPicker" data-live-search="true">
			<option data-tokens="ketchup mustard">Select MFI Type</option>
			<option data-tokens="ketchup mustard">MFI 1</option>
			<option data-tokens="ketchup mustard">MFI 2</option>
			<option data-tokens="ketchup mustard">MFI 3</option>
			</select>
			<br>
			</br>
			<br>
			</br>
			<select class="loanPicker" data-live-search="true">
			<option data-tokens="ketchup mustard">Select Loan Type</option>
			<option data-tokens="ketchup mustard">Loan 1</option>
			<option data-tokens="ketchup mustard">Loan 2</option>
			<option data-tokens="ketchup mustard">Loan 3</option>
			</select>
			<br>
			</br>
			<br>
			</br>
			
			<TextField typeVal="String" limit="100"  />
		</div>
		)
	}
}
export default NewLoan
