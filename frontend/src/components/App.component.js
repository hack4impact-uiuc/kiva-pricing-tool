// @flow
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Grid, Jumbotron } from 'react-bootstrap'
import { StuffList } from './'
import './../styles/app.css'
import FormOne from './FormOne'

class App extends Component<void> {
  render() {
    return <FormOne />
  }
}

export default App
