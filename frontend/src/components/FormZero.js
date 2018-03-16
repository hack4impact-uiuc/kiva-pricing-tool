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
		loan_themes: []
    }
	}
	componentDidMount() {
		axios.get('http://127.0.0.1:3453/partnerThemeLists')
			.then(response => {
				this.setState({partner_names: response.data.result.partners})
				this.setState({loan_themes: response.data.result.themes})
				console.log(this.state.partner_names)
				console.log(this.state.loan_themes)
		});
	}
	
  render() {
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
		<NewLoan label = "mfi" list = {this.state.partner_names} hint = "Select MFI Partner"  />
		<br>
		</br>
		<NewLoan label = "loan" list = {this.state.loan_themes} hint = "Select Loan Type" />
        <TextField text = "fname" hint="Loan Product" typeVal="String" limit={100} />
		<br>
		</br>
		<Button name = "Continue" url = "form1" onClick={this.handleClick} />
		</div>
		</form>
          </Grid>
        </Jumbotron>
      </div>
	)
  }
}

export default FormZero
