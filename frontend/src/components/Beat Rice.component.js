// @flow
import React, { Component, View, StyleSheet } from 'react'
import { Link } from 'react-router-dom'
import { Dropdown, StuffList, Button } from './'
import { TextInput } from './'
import { Grid, Jumbotron, PageHeader, Form } from 'react-bootstrap'
import Bootstrap from 'react-bootstrap'
import './../styles/app.scss'

class App extends Component<void> {
  render() {
    return (
      <Jumbotron className="banner">
        <Grid>
          <PageHeader>User Information</PageHeader>
          <Form inline>
            <TextInput title="First Name" info="ex. John" />
            <TextInput title="Last Name" info="ex. Smith" />
          </Form>

          <PageHeader>Basic Loan Conditions</PageHeader>

          <Form inline>
            <Dropdown
              title="Repayment Type"
              items={[
                { id: 1, value: 'Equal Principal Payments' },
                { id: 2, value: 'Equal Installments' },
                { id: 3, value: 'Single end-term principal payment' }
              ]}
            />
            <Dropdown
              title="Interest Payment:"
              items={[
                { id: 1, value: 'Multiple Installments' },
                { id: 2, value: 'Single End-Term Payments' }
              ]}
            />
            <Dropdown
              title="Interest Calculation:"
              items={[
                { id: 1, value: 'Initial Amount' },
                { id: 2, value: 'Flat Declining Balance' }
              ]}
            />
          </Form>

          <br />
          <Form inline>
            <TextInput title="Loan Amount" info="ex. 5000" />
            {'     '}

            <TextInput title="Number of Installments" info="ex. 12" />
            <Dropdown
              title="Time Period:"
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
            {' '}
            <small> </small>{' '}
          </h2>

          <Form inline>
            <TextInput title="Nominal Interest Rate Percent" info="0-200%" />
            <Dropdown
              title="Time Period:"
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
            <TextInput title="Capital" info="ex. x" />
            <TextInput title="Int Pmt" info="ex. x" />
            <TextInput title="Int Calc" info="ex. x" />
            <TextInput title="Balloon" info="ex. x" />
          </Form>

          <PageHeader>Fees and Taxes</PageHeader>

          <h2>
            {' '}
            <small> Fees </small>{' '}
          </h2>

          <Form inline>
            <TextInput title="Fee%" info="Upfront" />
            <TextInput title="Fee%" info="Ongoing" />
            <TextInput title="Fee (fixed amt)" info="Upfront" />
            <TextInput title="Fee (fixed amt)" info="Ongoing" />
          </Form>

          <h2>
            {' '}
            <small> Taxes </small>{' '}
          </h2>

          <Form inline>
            <TextInput title="Value Added Tax % on Fees" />
            <TextInput title="Value Added Tax % on Interest" />
          </Form>

          <PageHeader>Insurance</PageHeader>

          <Form inline>
            <TextInput title="Insurance %" info="Upfront" />
            <TextInput title="Insurance %" info="Ongoing" />
            <TextInput title="Insurance (fixed amt)" info="Upfront" />
            <TextInput title="Insurance (fixed amt)" info="Ongoing" />
          </Form>

          <PageHeader>Security Deposit</PageHeader>

          <Form inline>
            <TextInput title="Security Deposit %" info="Upfront" />
            <TextInput title="Security Deposit %" info="Ongoing" />
            <TextInput title="Security Deposit (fixed amt)" info="Upfront" />
            <TextInput title="Security Deposit (fixed amt)" info="Ongoing" />
            <TextInput title="Interest Paid on Deposit" />
          </Form>

          <Button name="Back" />
          <Button name="Next" />
        </Grid>
      </Jumbotron>
    )
  }
}

export default App
