// @flow
import React, { Component, View, StyleSheet } from 'react'
import { Link } from 'react-router-dom'
import { Dropdown, StuffList, Button, TextField } from './'
import { Grid, Jumbotron, PageHeader, Form } from 'react-bootstrap'
import Bootstrap from 'react-bootstrap'
import './../styles/app.scss'

class APRRateDisplay extends Component<void> {
  render() {
    return (
      <Jumbotron className="banner">
        <Grid>
          <PageHeader> APR Rate: 350% Damn what a thicc rate </PageHeader>
          <Button name="Back" url="form1" onClickHandler={() => {}} />
          <Button
            name="Save Loan"
            onClickHandler={() => {
              alert('Please kill me now and end my suffering')
            }}
          />
        </Grid>
      </Jumbotron>
    )
  }
}

export default APRRateDisplay
