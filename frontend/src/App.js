import React, { Component } from 'react'
import { Grid, Navbar, Jumbotron } from 'react-bootstrap'
import './styles/app.css'
import TextField from './Components/TextField'

class App extends Component {
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
            <h1>Kiva TextField</h1>
            <TextField text = "fname" hint="Enter First Name" />
          </Grid>
        </Jumbotron>
      </div>
    )
  }
}

export default App
