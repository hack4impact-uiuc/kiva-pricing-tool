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
            <Button name="New Loan" url="newloan" onClickHandler={() => {}} />
          </Grid>
        </Jumbotron>
      </div>
    )
  }
}

export default App
