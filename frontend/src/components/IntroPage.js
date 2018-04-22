import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Grid, Jumbotron, PageHeader, Bootstrap } from 'react-bootstrap'
import './../styles/app.css'
import Button from './Button'
class IntroPage extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const { resetFormData } = this.props
    resetFormData()
  }

  render() {
    return (
      <Grid>
        <Button name="Enter New Loan" url="newloan" />
        <Button name="Find Loan" url="findloan" />
      </Grid>
    )
  }
}
export default IntroPage
