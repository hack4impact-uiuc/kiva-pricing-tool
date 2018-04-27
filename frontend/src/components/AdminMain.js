import React, { Component } from 'react'
import { Grid, Jumbotron, PageHeader, Bootstrap } from 'react-bootstrap'
import './../styles/app.css'
import Button from './Button'

class AdminMain extends Component {
  render() {
    return (
      <Grid>
        <Button
          name="MFI Partner List"
          url="partnerlist"
          onClickHandler={() => {
            console.log('going to new loan')
          }}
        />

        <Button
          name="Loan Theme List"
          url="themelist"
          onClickHandler={() => {
            console.log('going to find loan')
          }}
        />
      </Grid>
    )
  }
}

export default AdminMain
