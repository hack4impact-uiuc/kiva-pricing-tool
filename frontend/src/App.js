import React, { Component } from 'react'
import { Forms, Dropdowns, Grid, Navbar, Jumbotron } from 'react-bootstrap'
import Bootstrap from 'react-bootstrap'
import './styles/app.css'
import TextField from './Components/TextField'
import NewLoan from './Components/NewLoan'

class App extends Component {
  render() {
	  var mfiList = [{mfi: 'Kiva1'}, {mfi: 'Kiva2'}, {mfi: 'Kiva3'},{mfi: 'Kiva4'},];
	  var loanList = [{loan: 'Loan1'},{loan: 'Loan2'},{loan: 'Loan3'},{loan: 'Loan4'},];
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
		<div class = "col-lg-9">
           	 <h1>Kiva TextField</h1>
            	<TextField text = "fname" hint="Enter Some Details" typeVal="Int" limit={100} />
		<NewLoan label = "mfi" list = {mfiList} hint = "Select MFI Partner"/>
		<NewLoan label = "loan" list = {loanList} hint = "Select Loan Type"/>
		</div>
          </Grid>
        </Jumbotron>
      </div>
    )
  }
}

export default App
