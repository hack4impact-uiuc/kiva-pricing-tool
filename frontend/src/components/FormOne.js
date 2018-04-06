// @flow
import React, { Component, View, StyleSheet } from 'react'
import { connect } from 'react-redux'
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

  handleTextChange = (name, value) => {
    const { changedFormData } = this.props
    changedFormData([name], [value])
  }

  postData() {
    const { formDataReducer } = this.props
    let data = {
      partner_name: formDataReducer.mfi,
      loan_theme: formDataReducer.loanType,
      product_type: formDataReducer.productType,
      version_num: formDataReducer.versionNum,
      update_name: formDataReducer.updateName,
      start_name: formDataReducer.startName,
      installment_time_period: formDataReducer.installmentTimePeriod,
      repayment_type: formDataReducer.repaymentType,
      interest_time_period: formDataReducer.interestTimePeriod,
      interest_payment_type: formDataReducer.interestPaymentType,
      interest_calculation_type: formDataReducer.interestCalculationType,
      loan_amount: formDataReducer.loanAmount,
      installment: formDataReducer.installment,
      nominal_interest_rate: formDataReducer.nominalInterestRate,
      grace_period_principal: formDataReducer.gracePeriodPrincipal,
      grace_period_interest_pay: formDataReducer.gracePeriodInterestPay,
      grace_period_interest_calculate:
        formDataReducer.gracePeriodInterestCalculate,
      grace_period_balloon: formDataReducer.gracePeriodBalloon,
      fee_percent_upfront: formDataReducer.feePercentUpfront,
      fee_percent_ongoing: formDataReducer.feePercentOngoing,
      fee_fixed_upfront: formDataReducer.feeFixedUpfront,
      fee_fixed_ongoing: formDataReducer.feeFixedOngoing,
      tax_percent_fees: formDataReducer.taxPercentFees,
      tax_percent_interest: formDataReducer.taxPercentInterest,
      insurance_percent_upfront: formDataReducer.insurancePercentUpfront,
      insurance_percent_ongoing: formDataReducer.insurancePercentOngoing,
      insurance_fixed_upfront: formDataReducer.insuranceFixedUpfront,
      insurance_fixed_ongoing: formDataReducer.insuranceFixedOngoing,
      security_deposit_percent_upfront:
        formDataReducer.securityDeposityPercentUpfront,
      security_deposit_percent_ongoing:
        formDataReducer.securityDepositPercentOngoing,
      security_deposit_fixed_upfront:
        formDataReducer.securityDepositFixedUpfront,
      security_deposit_fixed_ongoing:
        formDataReducer.securityDepositFixedOngoing,
      interest_paid_on_deposit_percent:
        formDataReducer.interestPaidOnDepositPercent
    }

    axios
      .post('http://127.0.0.1:3453/calculateAPR', data)
      .then(response => {
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
    const { formDataReducer, contNewLoan, changedFormData } = this.props
    return (
      <Grid>
        <PageHeader>User Information</PageHeader>
        <Form inline>
          <TextField
            id="Full Name"
            reduxId="startName"
            hint="ex. John"
            typeVal="String"
            limit="100"
            textBody={formDataReducer.startName}
            onTextInputChange={this.handleTextChange}
          />
        </Form>

        <PageHeader>Basic Loan Conditions</PageHeader>

        <Form inline>
          <Dropdown
            title="Repayment Type:"
            reduxId="repaymentType"
            items={[
              //must match backend! IMPORTANT
              { id: '1', value: 'equal principal payments' },
              { id: '2', value: 'equal installments (amortized)' },
              { id: '3', value: 'single end-term principal payment' }
            ]}
            onTextInputChange={this.handleTextChange}
            selected={formDataReducer.repaymentType}
          />
          <Dropdown
            title="Interest Payment:"
            reduxId="interestPaymentType"
            items={[
              { id: '1', value: 'Multiple Installments' },
              { id: '2', value: 'Single End-Term Payments' }
            ]}
            onTextInputChange={this.handleTextChange}
            selected={formDataReducer.interestPaymentType}
          />
          <Dropdown
            title="Interest Calculation:"
            reduxId="interestCalculationType"
            items={[
              { id: '1', value: 'initial amount or flat' },
              // { id: '2', value: 'Flat' },
              { id: '2', value: 'declining balance' }
            ]}
            onTextInputChange={this.handleTextChange}
            selected={formDataReducer.interestCalculationType}
          />
        </Form>

        <br />
        <Form inline>
          <TextField
            id="Loan Amount"
            reduxId="loanAmount"
            hint="ex. 5000"
            typeVal="float"
            limit="900000000"
            textBody={formDataReducer.loanAmount}
            onTextInputChange={this.handleTextChange}
          />
          <TextField
            id="Number of Terms"
            reduxId="installment"
            hint="ex. 12"
            typeVal="int"
            limit="180"
            textBody={formDataReducer.installment}
            onTextInputChange={this.handleTextChange}
          />
          <TextField
            id="Nominal Interest Rate"
            reduxId="nominalInterestRate"
            hint="ex. 12"
            typeVal="int"
            limit="100"
            textBody={formDataReducer.nominalInterestRate}
            onTextInputChange={this.handleTextChange}
          />
        </Form>

        <Form inline>
          <Dropdown
            title="Time Period:"
            reduxId="installmentTimePeriod"
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
            onTextInputChange={this.handleTextChange}
            selected={formDataReducer.installmentTimePeriod}
          />
          <Dropdown
            title="Time Period:"
            reduxId="interestTimePeriod"
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
            onTextInputChange={this.handleTextChange}
            selected={formDataReducer.interestTimePeriod}
          />
        </Form>

        <h2>
          <small> Grace or Prepay </small>
        </h2>
        <Form inline>
          <TextField
            id="Capital"
            reduxId="gracePeriodPrincipal"
            hint="ex. 1"
            typeVal="float"
            limit="180"
            textBody={formDataReducer.gracePeriodPrincipal}
            onTextInputChange={this.handleTextChange}
          />
          <TextField
            id="Int Pmt"
            reduxId="gracePeriodInterestPay"
            hint="ex. 1"
            typeVal="float"
            limit="180"
            textBody={formDataReducer.gracePeriodInterestPay}
            onTextInputChange={this.handleTextChange}
          />
          <TextField
            id="Int Calc"
            reduxId="gracePeriodInterestCalculate"
            hint="ex. 1"
            typeVal="float"
            limit="180"
            textBody={formDataReducer.gracePeriodInterestCalculate}
            onTextInputChange={this.handleTextChange}
          />
          <TextField
            id="Balloon"
            reduxId="gracePeriodBalloon"
            hint="ex. 1"
            typeVal="float"
            limit="180"
            textBody={formDataReducer.gracePeriodBalloon}
            onTextInputChange={this.handleTextChange}
          />
        </Form>

        <PageHeader>Fees and Taxes</PageHeader>

        <h2>
          <small> Fees </small>
        </h2>

        <Form inline>
          <TextField
            id="Fee%"
            reduxId="feePercentUpfront"
            hint="Upfront"
            typeVal="float"
            limit="180"
            textBody={formDataReducer.feePercentUpfront}
            onTextInputChange={this.handleTextChange}
          />
          <TextField
            id="Fee%"
            reduxId="feePercentOngoing"
            hint="Ongoing"
            typeVal="float"
            limit="180"
            textBody={formDataReducer.feePercentOngoing}
            onTextInputChange={this.handleTextChange}
          />
          <TextField
            id="Fee (fixed amt)"
            reduxId="feeFixedUpfront"
            hint="Upfront"
            typeVal="float"
            limit="100000000"
            textBody={formDataReducer.feeFixedUpfront}
            onTextInputChange={this.handleTextChange}
          />
          <TextField
            id="Fee (fixed amt)"
            reduxId="feeFixedOngoing"
            hint="Ongoing"
            typeVal="float"
            limit="100000000"
            textBody={formDataReducer.feeFixedOngoing}
            onTextInputChange={this.handleTextChange}
          />
        </Form>

        <h2>
          <small> Taxes </small>
        </h2>

        <Form inline>
          <TextField
            id="Value Added Tax % on Fees"
            reduxId="taxPercentFees"
            typeVal="float"
            limit="100"
            textBody={formDataReducer.taxPercentFees}
            onTextInputChange={this.handleTextChange}
          />
          <TextField
            id="Value Added Tax % on Interest"
            reduxId="taxPercentInterest"
            typeVal="float"
            limit="100"
            textBody={formDataReducer.taxPercentInterest}
            onTextInputChange={this.handleTextChange}
          />
        </Form>

        <PageHeader>Insurance</PageHeader>

        <Form inline>
          <TextField
            id="Insurance %"
            reduxId="insurancePercentUpfront"
            hint="Upfront"
            typeVal="float"
            limit="100"
            textBody={formDataReducer.insurancePercentUpfront}
            onTextInputChange={this.handleTextChange}
          />
          <TextField
            id="Insurance %"
            reduxId="insurancePercentOngoing"
            hint="Ongoing"
            typeVal="float"
            limit="100"
            textBody={formDataReducer.insurancePercentOngoing}
            onTextInputChange={this.handleTextChange}
          />
          <TextField
            id="Insurance (fixed amt)"
            reduxId="insuranceFixedUpfront"
            hint="Upfront"
            typeVal="float"
            limit="900000000"
            textBody={formDataReducer.insuranceFixedUpfront}
            onTextInputChange={this.handleTextChange}
          />
          <TextField
            id="Insurance (fixed amt)"
            reduxId="insuranceFixedOngoing"
            hint="Ongoing"
            typeVal="float"
            limit="900000000"
            textBody={formDataReducer.insuranceFixedOngoing}
            onTextInputChange={this.handleTextChange}
          />
        </Form>

        <PageHeader>Security Deposit</PageHeader>

        <Form inline>
          <TextField
            id="Security Deposit %"
            reduxId="securityDepositPercentUpfront"
            hint="Upfront"
            typeVal="float"
            limit="100"
            textBody={formDataReducer.securityDepositPercentUpfront}
            onTextInputChange={this.handleTextChange}
          />
          <TextField
            id="Security Deposit %"
            reduxId="securityDepositPercentOngoing"
            hint="Ongoing"
            typeVal="float"
            limit="100"
            textBody={formDataReducer.securityDepositPercentOngoing}
            onTextInputChange={this.handleTextChange}
          />
          <TextField
            id="Security Deposit (fixed amt)"
            reduxId="securityDepositFixedUpfront"
            hint="Upfront"
            typeVal="float"
            limit="900000000"
            textBody={formDataReducer.securityDepositFixedUpfront}
            onTextInputChange={this.handleTextChange}
          />
          <TextField
            id="Security Deposit (fixed amt)"
            reduxId="securityDepositFixedOngoing"
            hint="Ongoing"
            typeVal="float"
            limit="900000000"
            textBody={formDataReducer.securityDepositFixedOngoing}
            onTextInputChange={this.handleTextChange}
          />
          <TextField
            id="Interest Paid on Deposit"
            reduxId="interestPaidOnDepositPercent"
            typeVal="float"
            limit="900000000"
            textBody={formDataReducer.interestPaidOnDepositPercent}
            onTextInputChange={this.handleTextChange}
          />
        </Form>

        <Button name="Back" url="findloan" />
        <Button
          name="Next"
          url="output"
          aprRate={this.state.aprRate}
          onClickHandler={e => {
            this.postData()
          }}
        />
      </Grid>
    )
  }
}

export default FormOne
