// @flow
import React, { Component, View, StyleSheet } from 'react'
import { Link } from 'react-router-dom'
import { Dropdown, StuffList, Button, TextField } from './'
import { Grid, Jumbotron, PageHeader, Form } from 'react-bootstrap'
import Bootstrap from 'react-bootstrap'
import './../styles/app.scss'
import axios from 'axios'

class APRRateDisplay extends Component<void> {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Jumbotron className="banner">
        <Grid>
          <PageHeader>
            {' '}
            APR Rate: {this.props.aprRate} Damn what a thicc rate{' '}
          </PageHeader>
          <Button name="Back" url="" onClickHandler={() => {}} />
          <Button
            name="Save Loan"
            onClickHandler={() => {
              alert('OOOOH BABYYYYY!')
            }}
          />
        </Grid>
      </Jumbotron>
    )
  }
}

export default APRRateDisplay
