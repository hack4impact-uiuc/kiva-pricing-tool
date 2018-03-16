import React, { Component } from 'react'
import { Forms, Dropdowns, Grid, Navbar, Jumbotron } from 'react-bootstrap'
import Bootstrap from 'react-bootstrap'
import './../styles/app.css'
import TextField from './TextField'
import NewLoan from './NewLoan'
import Button from './Button'
import axios from 'axios'

class FormZero extends Component {
    constructor(props) {
    super(props)
    this.state = {
	partner_names: [],
	loan_themes: [],
	selectedPartnerName: '',
	selectedLoanTheme: '',
	selectedLoanProduct: '',
	disableButton: '',
	errorMessage: ''
    }
    }
	
    componentDidMount() {
	axios.get('http://127.0.0.1:3453/partnerThemeLists')
		.then(response => {
		this.setState({partner_names: response.data.result.partners})
		this.setState({loan_themes: response.data.result.themes})
	});
	axios.get('https://api.github.com/users/jlp-io')
		.then(response => {
		console.log(response.data)
		});
    }
	
  render() { 
	 /*
	 //attempt to create state values based on child, using refs as an identifier for each component instance
	 this.setState({selectedPartnerName: this.refs.mfi.state.value});
	 console.log(this.state.selectedParterName);
	 this.setState({selectedLoanTheme: this.refs.loan.state.value});
 	 console.log(this.state.selectedLoanTheme);
 	 this.setState({selectedLoanProduct: this.refs.product.state.value});
	 console.log(this.state.selectedLoanProduct);
	 if (this.state.selectedPartnerName == '' || this.state.selectedLoanTheme == '' || this.state.selectedLoanProduct == '') {
		 this.setState({disableButton: "false"});
	 }else{
		 this.setState({disableButton: ""});
	 }
	 */
   return (
      <div>
        <Navbar inverse fixedTop>
          <Grid>
            <Navbar.Header>
              <Navbar.Brand>
                <a href="/">Hi</a>
              </Navbar.Brand>
              <Navbar.Toggle />
            </Navbar.Header>
          </Grid>
        </Navbar>
        <Jumbotron className="banner">
          <Grid>			
		<form>
		<div class = "col-lg-11">
		<br>
		</br>
		<NewLoan ref = "mfi" label = "mfi" list = {this.state.partner_names} hint = "Select MFI Partner"  />
		<br>
		</br>
		<NewLoan ref = "loan" label = "loan" list = {this.state.loan_themes} hint = "Select Loan Type" />
       	<TextField ref = "product" text = "product" hint="Loan Product" typeVal="String" limit={100} />
		<br>
		</br>
		<Button disable = {this.state.disableButton} name = "Continue" url = "form1" onClick={this.handleClick} formProps={this.state.selectedPartnerName, this.state.selectedLoanTheme,
			this.state.selectedLoanProduct}
		/>		
		</div>
		</form>
          </Grid>
        </Jumbotron>
      </div>
	)
  }
}

export default FormZero
