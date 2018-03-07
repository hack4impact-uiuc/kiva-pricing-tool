// @flow
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Dropdown, StuffList } from './'
import { TextInput } from './'
import { Grid, Jumbotron, PageHeader, Form } from 'react-bootstrap'
import Bootstrap from 'react-bootstrap'
import './../styles/app.scss'

class App extends Component<void> {
  render() {
    return (
      <Jumbotron className="banner">
        <Grid>
          <PageHeader>
            <small>User Information</small>
          </PageHeader>
          <Form horizontal>
            <TextInput title="First Name" info="ex. John" />
            <TextInput title="Last Name" info="ex. Smith" />
          </Form>

          <PageHeader>
            <small>Basic Loan Conditions</small>
          </PageHeader>

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
            <TextInput title="Loan Amount" info="ex. 5000" />
            {'     '}

            <TextInput title="Number of Terms" info="ex. 12" />
          </Form>
          <h2>
            {' '}
            <small> </small>{' '}
          </h2>

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
            {' '}
            <small> Grace or Prepay </small>{' '}
          </h2>
          <Form inline>
            <TextInput title="Capital" info="ex. x" />
            <TextInput title="Int Pmt" info="ex. x" />
            <TextInput title="Int Calc" info="ex. x" />
            <TextInput title="Balloon" info="ex. x" />
          </Form>
        </Grid>
      </Jumbotron>
    )
  }
}

export default App
