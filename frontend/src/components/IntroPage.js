import React, { Component } from 'react'
import { Grid, Jumbotron, PageHeader, Bootstrap } from 'react-bootstrap'
import './../styles/app.css'
import Button from './Button'
class IntroPage extends Component {
  render() {
    return (
      <Grid>
        <Button
          name="Enter New Loan"
          url="newloan"
          onClickHandler={() => {
            console.log('going to new loan')
          }}
        />
      </Grid>
    )
  }
}
export default IntroPage
