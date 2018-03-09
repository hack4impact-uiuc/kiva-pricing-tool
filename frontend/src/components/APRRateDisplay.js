// @flow
import React, { Component, View, StyleSheet } from 'react'
import { Link } from 'react-router-dom'
import { Dropdown, StuffList, Button } from './'
import { TextField } from './'
import { Grid, Jumbotron, PageHeader, Form } from 'react-bootstrap'
import Bootstrap from 'react-bootstrap'
import './../styles/app.scss'

class APRRateDisplay extends Component<void> {
  render() {
    return (
      <Grid>
        <h1 APR Rate />
        <Button name="Back" />
        <Button name="Save Loan" />
      </Grid>
    )
  }
}

export default APRRateDisplay
