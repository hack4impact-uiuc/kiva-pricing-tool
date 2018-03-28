// @flow
import React, { Component, View, StyleSheet } from 'react'
import { Link, Route, withRouter } from 'react-router-dom'
import { Dropdown, StuffList, Button, TextField, APRRateDisplay } from './'
import { Grid, Jumbotron, PageHeader, Form, Bootstrap } from 'react-bootstrap'
import axios from 'axios'

import './../styles/app.scss'

class FormOne extends Component<void> {
  constructor(props) {
    super(props)
    this.state = {
      aprRate: '',
      saveData: {}
    }
  }

  postData() {
    let data = {
      partner_name: 'African Leadership Academy',
      loan_theme: 'Agriculture (Women)',
      product_type: 'Small Loan',
      version_num: '7',
      update_name: 'David Chang',

      start_name: this.refs.firstName.state.textBody,
      installment_time_period: this.refs.installment_time_period.state.value,
      repayment_type: this.refs.repaymentType.state.value,
      interest_time_period: this.refs.interest_time_period.state.value,
      interest_payment_type: this.refs.interest_payment_type.state.value,
      interest_calculation_type: this.refs.interest_calculation_type.state
        .value,
      loan_amount: this.refs.loan_amount.state.textBody,
      installment: this.refs.installment.state.textBody,
      nominal_interest_rate: this.refs.nominal_interest_rate.state.textBody,
      grace_period_principal: this.refs.grace_period_principal.state.textBody,
      grace_period_interest_pay: this.refs.grace_period_interest_pay.state
        .textBody,
      grace_period_interest_calculate: this.refs.grace_period_interest_calculate
        .state.textBody,
      grace_period_balloon: this.refs.grace_period_balloon.state.textBody,
      fee_percent_upfront: this.refs.fee_percent_upfront.state.textBody,
      fee_percent_ongoing: this.refs.fee_percent_ongoing.state.textBody,
      fee_fixed_upfront: this.refs.fee_fixed_upfront.state.textBody,
      fee_fixed_ongoing: this.refs.fee_fixed_ongoing.state.textBody,
      tax_percent_fees: this.refs.tax_percent_fees.state.textBody,
      tax_percent_interest: this.refs.tax_percent_interest.state.textBody,
      insurance_percent_upfront: this.refs.insurance_percent_upfront.state
        .textBody,
      insurance_percent_ongoing: this.refs.insurance_percent_ongoing.state
        .textBody,
      insurance_fixed_upfront: this.refs.insurance_fixed_upfront.state.textBody,
      insurance_fixed_ongoing: this.refs.insurance_fixed_ongoing.state.textBody,
      security_deposit_percent_upfront: this.refs
        .security_deposit_percent_upfront.state.textBody,
      security_deposit_percent_ongoing: this.refs
        .security_deposit_percent_ongoing.state.textBody,
      security_deposit_fixed_upfront: this.refs.security_deposit_fixed_upfront
        .state.textBody,
      security_deposit_fixed_ongoing: this.refs.security_deposit_fixed_ongoing
        .state.textBody,
      interest_paid_on_deposit_percent: this.refs
        .interest_paid_on_deposit_percent.state.textBody
    }
    console.log(data)
    axios
      .post('http://127.0.0.1:3453/calculateAPR', data)
      .then(response => {
        console.log(response)
        const apr = response.data.result.apr
        data['nominal_apr'] = apr.toString()
        this.setState({
          aprRate: apr,
          saveData: data
        })
        console.log(response.data.result.apr)
      })
      .catch(function(error) {
        console.log(
          error + ' there was an error with the request' + data.start_name
        )
      })
  }

  saveData() {
    console.log(this.state.saveData)
    axios
      .post('http://127.0.0.1:3453/saveNewLoan', this.state.saveData)
      .then(response => {
        console.log(response)
      })
      .catch(function(error) {
        console.log(error.message + ' there was an error with the request')
      })
  }

  getAPRRate() {
    return this.state.aprRate
  }

  changeContent() {
    this.setState({ aprRate: '' })
  }

  render() {
    //will have to render like this until we incorporate redux
    if (!this.state.aprRate) {
      return (
        <Grid>
          <PageHeader>User Information</PageHeader>
          <Form inline>
            <TextField
              id="First Name"
              hint="ex. John"
              typeVal="String"
              limit="100"
              ref="firstName"
            />
            <TextField
              id="Last Name"
              hint="ex. Smith"
              typeVal="String"
              limit="100"
              ref="lastName"
            />
          </Form>

          <PageHeader>Basic Loan Conditions</PageHeader>

          <Form inline>
            <Dropdown
              title="Repayment Type:"
              items={[
                //must match backend! IMPORTANT
                { id: '1', value: 'equal principal payments' },
                { id: '2', value: 'equal installments (amortized)' },
                { id: '3', value: 'single end-term principal payment' }
              ]}
              ref="repaymentType"
            />
            <Dropdown
              title="Interest Payment:"
              items={[
                { id: '1', value: 'Multiple Installments' },
                { id: '2', value: 'Single End-Term Payments' }
              ]}
              ref="interest_payment_type"
            />
            <Dropdown
              title="Interest Calculation:"
              items={[
                { id: '1', value: 'initial amount or flat' },
                // { id: '2', value: 'Flat' },
                { id: '2', value: 'declining balance' }
              ]}
              ref="interest_calculation_type"
            />
          </Form>

          <br />
          <Form inline>
            <TextField
              id="Loan Amount"
              hint="ex. 5000"
              typeVal="float"
              limit="900000000"
              ref="loan_amount"
            />
            <TextField
              id="Number of Terms"
              hint="ex. 12"
              typeVal="int"
              limit="180"
              ref="installment"
            />
            <TextField
              id="Nominal Interest Rate"
              hint="ex. 12"
              typeVal="int"
              limit="100"
              ref="nominal_interest_rate"
            />
          </Form>

          <Form inline>
            <Dropdown
              title="Time Period:"
              items={[
                { id: '1', value: 'days' },
                { id: '7', value: 'weeks' },
                { id: '14', value: 'two-weeks' },
                { id: '15', value: '15 days' },
                { id: '28', value: '4 weeks' },
                { id: '30', value: 'months' },
                { id: '90', value: 'quarters' },
                { id: '180', value: 'half-years' },
                { id: '365', value: 'years' }
              ]}
              ref="installment_time_period"
            />
            <Dropdown
              title="Time Period:"
              //{'day':0, 'week':1, 'two-weeks':2, '15 days':3, '4 weeks':4,
              //'month':5, 'quarter':6, 'half-year':7, 'year':8}
              items={[
                { id: '0', value: 'day' },
                { id: '1', value: 'week' },
                { id: '2', value: 'two-weeks' },
                { id: '3', value: '15 days' },
                { id: '4', value: '4 weeks' },
                { id: '5', value: 'month' },
                { id: '6', value: 'quarter' },
                { id: '7', value: 'half-year' },
                { id: '8', value: 'year' }
              ]}
              ref="interest_time_period"
            />
          </Form>

          <h2>
            <small> Grace or Prepay </small>
          </h2>
          <Form inline>
            <TextField
              id="Capital"
              hint="ex. 1"
              typeVal="float"
              limit="180"
              ref="grace_period_principal"
            />
            <TextField
              id="Int Pmt"
              hint="ex. 1"
              typeVal="float"
              limit="180"
              ref="grace_period_interest_pay"
            />
            <TextField
              id="Int Calc"
              hint="ex. 1"
              typeVal="float"
              limit="180"
              ref="grace_period_interest_calculate"
            />
            <TextField
              id="Balloon"
              hint="ex. 1"
              typeVal="float"
              limit="180"
              ref="grace_period_balloon"
            />
          </Form>

          <PageHeader>Fees and Taxes</PageHeader>

          <h2>
            <small> Fees </small>
          </h2>

          <Form inline>
            <TextField
              id="Fee%"
              hint="Upfront"
              typeVal="float"
              limit="180"
              ref="fee_percent_upfront"
            />
            <TextField
              id="Fee%"
              hint="Ongoing"
              typeVal="float"
              limit="180"
              ref="fee_percent_ongoing"
            />
            <TextField
              id="Fee (fixed amt)"
              hint="Upfront"
              typeVal="float"
              limit="100000000"
              ref="fee_fixed_upfront"
            />
            <TextField
              id="Fee (fixed amt)"
              hint="Ongoing"
              typeVal="float"
              limit="100000000"
              ref="fee_fixed_ongoing"
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
              ref="tax_percent_fees"
            />
            <TextField
              id="Value Added Tax % on Interest"
              typeVal="float"
              limit="100"
              ref="tax_percent_interest"
            />
          </Form>

          <PageHeader>Insurance</PageHeader>

          <Form inline>
            <TextField
              id="Insurance %"
              hint="Upfront"
              typeVal="float"
              limit="100"
              ref="insurance_percent_upfront"
            />
            <TextField
              id="Insurance %"
              hint="Ongoing"
              typeVal="float"
              limit="100"
              ref="insurance_percent_ongoing"
            />
            <TextField
              id="Insurance (fixed amt)"
              hint="Upfront"
              typeVal="float"
              limit="900000000"
              ref="insurance_fixed_upfront"
            />
            <TextField
              id="Insurance (fixed amt)"
              hint="Ongoing"
              typeVal="float"
              limit="900000000"
              ref="insurance_fixed_ongoing"
            />
          </Form>

          <PageHeader>Security Deposit</PageHeader>

          <Form inline>
            <TextField
              id="Security Deposit %"
              hint="Upfront"
              typeVal="float"
              limit="100"
              ref="security_deposit_percent_upfront"
            />
            <TextField
              id="Security Deposit %"
              hint="Ongoing"
              typeVal="float"
              limit="100"
              ref="security_deposit_percent_ongoing"
            />
            <TextField
              id="Security Deposit (fixed amt)"
              hint="Upfront"
              typeVal="float"
              limit="900000000"
              ref="security_deposit_fixed_upfront"
            />
            <TextField
              id="Security Deposit (fixed amt)"
              hint="Ongoing"
              typeVal="float"
              limit="900000000"
              ref="security_deposit_fixed_ongoing"
            />
            <TextField
              id="Interest Paid on Deposit"
              typeVal="float"
              limit="900000000"
              ref="interest_paid_on_deposit_percent"
            />
          </Form>

          <Button name="Back" url="" onClickHandler={() => {}} />
          <button
            onClick={e => {
              this.postData()
            }}
          >
            Next
          </button>
          {/* <Button
              name="Next"
              url="output"
              // aprRate ={ e => {
              //   this.getAPRRate()
              // }}
              onClickHandler={e => {
                this.postData()
              }}
            /> */}
        </Grid>
      )
    } else {
      return (
        <Grid>
          <PageHeader> APR Rate: {this.state.aprRate}%</PageHeader>
          <Button
            name="Back"
            url="form1"
            onClickHandler={e => {
              this.changeContent()
            }}
          />
          <Button
            name="Save Loan"
            url=""
            onClickHandler={() => {
              alert('Are you sure you want to save loan?')
              this.saveData()
            }}
          />
        </Grid>
      )
    }
  }
}

export default FormOne
