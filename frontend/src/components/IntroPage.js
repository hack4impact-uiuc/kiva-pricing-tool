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
        <Button
          name="New Loan"
          url="newloan"
          onClickHandler={() => {
            console.log('going to new loan')
          }}
        />

        <Button
          name="Find Loan"
          url="findloan"
          onClickHandler={() => {
            console.log('going to find loan')
          }}
        />

        <Button
          name="Admin Tools"
          url="adminmain"
          onClickHandler={() => {
            console.log('going to admin tools')
          }}
        />
      </Grid>
    )
  }
}
export default IntroPage
