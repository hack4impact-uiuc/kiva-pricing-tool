import React, { Component } from 'react'
import { Forms, Dropdowns, Grid, Navbar, Jumbotron } from 'react-bootstrap'
import Bootstrap from 'react-bootstrap'
import './styles/app.css'
import TextField from './components/TextField'
import NewLoan from './components/NewLoan'
import Button from './components/Button'

class App extends Component {
  render() {
    return (
      <div>
        <Jumbotron className="banner">
          <Grid>
            <h1>Kiva TextField</h1>
            <div class="col-lg-9">
              <NewLoan
                label="mfi"
                list={partner_names}
                hint="Select MFI Partner"
              />
              <NewLoan
                label="loan"
                list={loan_themes}
                hint="Select Loan Type"
              />
              <TextField
                id="Loan Product"
                text="fname"
                hint="i.e: small loan"
                typeVal="String"
                limit={100}
              />
              <Button name="Continue" url="form1" onClickHandler={() => {}} />
            </div>
          </Grid>
        </Jumbotron>
      </div>
    )
  }
}

export default App
