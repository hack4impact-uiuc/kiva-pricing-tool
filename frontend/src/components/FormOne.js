// @flow
import React, { Component, View, StyleSheet } from 'react'
import { Link } from 'react-router-dom'
import { Dropdown, StuffList, Button, TextField, APRRateDisplay } from './'
import { Grid, Jumbotron, PageHeader, Form } from 'react-bootstrap'
import Bootstrap from 'react-bootstrap'
import './../styles/app.scss'

class FormOne extends Component<void> {
  // sendFormData() {
  //   var axios = require('axios');
  //   axios.get('http://jsonplaceholder.typicode.com/todos')
  //   .then(function (response) {
  //     resultElement.innerHTML = generateSuccessHTMLOutput(response);
  //   })
  //   .catch(function (error) {
  //     resultElement.innerHTML = generateErrorHTMLOutput(error);
  //   });
  // }

  render() {
    return (
      <Jumbotron className="banner">
        <Grid>
          <PageHeader>User Information</PageHeader>
          <Form inline>
            <TextField
              id="First Name"
              hint="ex. John"
              typeVal="String"
              limit="100"
              // value={this.state.TextFieldValue}
            />
            <TextField
              id="Last Name"
              hint="ex. Smith"
              typeVal="String"
              limit="100"
            />
          </Form>

          <PageHeader>Basic Loan Conditions</PageHeader>

          <Form inline>
            <Dropdown
              title="Amortization:"
              items={[
                { id: '1', value: 'Equal Principal Payments' },
                { id: '2', value: 'Equal Installments' },
                { id: '3', value: 'Single end-term principal payment' }
              ]}
            />
            <Dropdown
              title="Interest:"
              items={[
                { id: '1', value: 'Multiple Installments' },
                { id: '2', value: 'Single End-Term Payments' }
              ]}
            />
          </Form>

          <br />
          <Form inline>
            <TextField
              id="Loan Amount"
              hint="ex. 5000"
              typeVal="float"
              limit="900000000"
            />
            <TextField
              id="Number of Terms"
              hint="ex. 12"
              typeVal="int"
              limit="180"
            />
          </Form>

          <Form inline>
            <Dropdown
              title="Term Length:"
              items={[
                { id: '1', value: 'Per Day' },
                { id: '7', value: 'Per Week' },
                { id: '14', value: 'Per 2 Week Period' },
                { id: '15', value: 'Per 15 Day Period' },
                { id: '28', value: 'Per 4 Week Period' },
                { id: '30', value: 'Per Month' },
                { id: '90', value: 'Per Quarter' },
                { id: '180', value: 'Per Half Year' },
                { id: '365', value: 'Per Year' }
              ]}
            />
            <Dropdown
              title="Nominal Interest Rate:"
              items={[
                { id: '1', value: 'Per Day' },
                { id: '7', value: 'Per Week' },
                { id: '14', value: 'Per 2 Week Period' },
                { id: '15', value: 'Per 15 Day Period' },
                { id: '28', value: 'Per 4 Week Period' },
                { id: '30', value: 'Per Month' },
                { id: '90', value: 'Per Quarter' },
                { id: '180', value: 'Per Half Year' },
                { id: '365', value: 'Per Year' }
              ]}
            />
          </Form>

          <h2>
            <small> Grace or Prepay </small>
          </h2>
          <Form inline>
            <TextField id="Capital" hint="ex. x" typeVal="float" limit="180" />
            <TextField id="Int Pmt" hint="ex. x" typeVal="float" limit="180" />
            <TextField id="Int Calc" hint="ex. x" typeVal="float" limit="180" />
            <TextField id="Balloon" hint="ex. x" typeVal="float" limit="180" />
          </Form>

          <PageHeader>Fees and Taxes</PageHeader>

          <h2>
            <small> Fees </small>
          </h2>

          <Form inline>
            <TextField id="Fee%" hint="Upfront" typeVal="float" limit="180" />
            <TextField id="Fee%" hint="Ongoing" typeVal="float" limit="180" />
            <TextField
              id="Fee (fixed amt)"
              hint="Upfront"
              typeVal="float"
              limit="100000000"
            />
            <TextField
              id="Fee (fixed amt)"
              hint="Ongoing"
              typeVal="float"
              limit="100000000"
            />
          </Form>

          <h2>
            <small> Taxes </small>
          </h2>

          <Form inline>
            <TextField
              id="Value Added Tax % on Fees"
              typeVal="float"
              limit="100"
            />
            <TextField
              id="Value Added Tax % on Interest"
              typeVal="float"
              limit="100"
            />
          </Form>

          <PageHeader>Insurance</PageHeader>

          <Form inline>
            <TextField
              id="Insurance %"
              hint="Upfront"
              typeVal="float"
              limit="100"
            />
            <TextField
              id="Insurance %"
              hint="Ongoing"
              typeVal="float"
              limit="100"
            />
            <TextField
              id="Insurance (fixed amt)"
              hint="Upfront"
              typeVal="float"
              limit="900000000"
            />
            <TextField
              id="Insurance (fixed amt)"
              hint="Ongoing"
              typeVal="float"
              limit="900000000"
            />
          </Form>

          <PageHeader>Security Deposit</PageHeader>

          <Form inline>
            <TextField
              id="Security Deposit %"
              hint="Upfront"
              typeVal="float"
              limit="100"
            />
            <TextField
              id="Security Deposit %"
              hint="Ongoing"
              typeVal="float"
              limit="100"
            />
            <TextField
              id="Security Deposit (fixed amt)"
              hint="Upfront"
              typeVal="float"
              limit="900000000"
            />
            <TextField
              id="Security Deposit (fixed amt)"
              hint="Ongoing"
              typeVal="float"
              limit="900000000"
            />
            <TextField
              id="Interest Paid on Deposit"
              typeVal="float"
              limit="900000000"
            />
          </Form>

          <Button name="Back" url="" />
          <Button name="Next" url="apr" />
        </Grid>
      </Jumbotron>
    )
  }
}

export default FormOne
