// @flow
import React, { Component, View, StyleSheet } from 'react'
import { connect } from 'react-redux'
import { Link, Route, withRouter } from 'react-router-dom'
import { Dropdown, Button, TextField, APRRateDisplay } from './'
import { Grid, Jumbotron, PageHeader, Form, Bootstrap } from 'react-bootstrap'
import axios from 'axios'

import './../styles/app.scss'
import { Api } from '../utils'

class APRInputs extends Component {
  constructor(props) {
    super(props)
    const { formDataReducer } = this.props
    this.state = {
      aprRate: '',
      saveData: {},
      back: formDataReducer.back
    }
  }

  handleTextChange = (name, value) => {
    const { changedFormData } = this.props
    changedFormData([name], [value])
  }

  inputsEntered() {
    const { formDataReducer } = this.props
    return (
      !this.isNullOrEmpty(formDataReducer.mfi) &&
      !this.isNullOrEmpty(formDataReducer.loanType) &&
      !this.isNullOrEmpty(formDataReducer.productType) &&
      !this.isNullOrEmpty(formDataReducer.versionNum) &&
      !this.isNullOrEmpty(formDataReducer.startName) &&
      !this.isNullOrEmpty(formDataReducer.installmentTimePeriod) &&
      !this.isNullOrEmpty(formDataReducer.repaymentType) &&
      !this.isNullOrEmpty(formDataReducer.interestTimePeriod) &&
      !this.isNullOrEmpty(formDataReducer.interestPaymentType) &&
      !this.isNullOrEmpty(formDataReducer.interestCalculationType) &&
      !this.isNullOrEmpty(formDataReducer.loanAmount) &&
      !this.isNullOrEmpty(formDataReducer.installment) &&
      !this.isNullOrEmpty(formDataReducer.nominalInterestRate) &&
      !this.isNullOrEmpty(formDataReducer.gracePeriodBalloon) &&
      !this.isNullOrEmpty(formDataReducer.gracePeriodPrincipal) &&
      !this.isNullOrEmpty(formDataReducer.gracePeriodInterestPay) &&
      !this.isNullOrEmpty(formDataReducer.gracePeriodInterestCalculate) &&
      !this.isNullOrEmpty(formDataReducer.feePercentOngoing) &&
      !this.isNullOrEmpty(formDataReducer.feePercentUpfront) &&
      !this.isNullOrEmpty(formDataReducer.feeFixedUpfront) &&
      !this.isNullOrEmpty(formDataReducer.feeFixedOngoing) &&
      !this.isNullOrEmpty(formDataReducer.taxPercentFees) &&
      !this.isNullOrEmpty(formDataReducer.taxPercentInterest) &&
      !this.isNullOrEmpty(formDataReducer.insurancePercentUpfront) &&
      !this.isNullOrEmpty(formDataReducer.insurancePercentOngoing) &&
      !this.isNullOrEmpty(formDataReducer.insuranceFixedUpfront) &&
      !this.isNullOrEmpty(formDataReducer.insuranceFixedOngoing) &&
      !this.isNullOrEmpty(formDataReducer.securityDepositPercentUpfront) &&
      !this.isNullOrEmpty(formDataReducer.securityDepositPercentOngoing) &&
      !this.isNullOrEmpty(formDataReducer.securityDepositFixedUpfront) &&
      !this.isNullOrEmpty(formDataReducer.securityDepositFixedOngoing) &&
      !this.isNullOrEmpty(formDataReducer.interestPaidOnDepositPercent)
    )
  }

  isNullOrEmpty(input) {
    return input == null || input.length == 0
  }

  postData() {
    const { formDataReducer } = this.props
    this.inputsEntered() && Api.postData(formDataReducer)
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
            selected={
              formDataReducer.repaymentType
                ? formDataReducer.repaymentType[0]
                : null
            }
          />
          <Dropdown
            title="Interest Payment:"
            reduxId="interestPaymentType"
            items={[
              { id: '1', value: 'Multiple Installments' },
              { id: '2', value: 'Single End-Term Payments' }
            ]}
            onTextInputChange={this.handleTextChange}
            selected={
              formDataReducer.interestPaymentType
                ? formDataReducer.interestPaymentType[0]
                : null
            }
          />
          <Dropdown
            title="Interest Calculation:"
            reduxId="interestCalculationType"
            items={[
              { id: '1', value: 'initial amount or flat' },
              { id: '2', value: 'declining balance' }
            ]}
            onTextInputChange={this.handleTextChange}
            selected={
              formDataReducer.interestCalculationType
                ? formDataReducer.interestCalculationType[0]
                : null
            }
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
          />
          <TextField
            id="Number of Terms"
            reduxId="installment"
            hint="ex. 12"
            typeVal="float"
            limit="180"
            textBody={formDataReducer.installment}
          />
          <TextField
            id="Nominal Interest Rate"
            reduxId="nominalInterestRate"
            hint="ex. 12"
            typeVal="float"
            limit="100"
            textBody={formDataReducer.nominalInterestRate}
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
            selected={
              formDataReducer.installmentTimePeriod
                ? formDataReducer.installmentTimePeriod[0]
                : null
            }
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
            selected={
              formDataReducer.interestTimePeriod
                ? formDataReducer.interestTimePeriod[0]
                : null
            }
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
            // onTextInputChange={this.handleTextChange}
          />
          <TextField
            id="Int Pmt"
            reduxId="gracePeriodInterestPay"
            hint="ex. 1"
            typeVal="float"
            limit="180"
            textBody={formDataReducer.gracePeriodInterestPay}
            // onTextInputChange={this.handleTextChange}
          />
          <TextField
            id="Int Calc"
            reduxId="gracePeriodInterestCalculate"
            hint="ex. 1"
            typeVal="float"
            limit="180"
            textBody={formDataReducer.gracePeriodInterestCalculate}
            // onTextInputChange={this.handleTextChange}
          />
          <TextField
            id="Balloon"
            reduxId="gracePeriodBalloon"
            hint="ex. 1"
            typeVal="float"
            limit="180"
            textBody={formDataReducer.gracePeriodBalloon}
            // onTextInputChange={this.handleTextChange}
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
            // onTextInputChange={this.handleTextChange}
          />
          <TextField
            id="Fee%"
            reduxId="feePercentOngoing"
            hint="Ongoing"
            typeVal="float"
            limit="180"
            textBody={formDataReducer.feePercentOngoing}
            // onTextInputChange={this.handleTextChange}
          />
          <TextField
            id="Fee (fixed amt)"
            reduxId="feeFixedUpfront"
            hint="Upfront"
            typeVal="float"
            limit="100000000"
            textBody={formDataReducer.feeFixedUpfront}
            // onTextInputChange={this.handleTextChange}
          />
          <TextField
            id="Fee (fixed amt)"
            reduxId="feeFixedOngoing"
            hint="Ongoing"
            typeVal="float"
            limit="100000000"
            textBody={formDataReducer.feeFixedOngoing}
            // onTextInputChange={this.handleTextChange}
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
            // onTextInputChange={this.handleTextChange}
          />
          <TextField
            id="Value Added Tax % on Interest"
            reduxId="taxPercentInterest"
            typeVal="float"
            limit="100"
            textBody={formDataReducer.taxPercentInterest}
            // onTextInputChange={this.handleTextChange}
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
            // onTextInputChange={this.handleTextChange}
          />
          <TextField
            id="Insurance %"
            reduxId="insurancePercentOngoing"
            hint="Ongoing"
            typeVal="float"
            limit="100"
            textBody={formDataReducer.insurancePercentOngoing}
            // onTextInputChange={this.handleTextChange}
          />
          <TextField
            id="Insurance (fixed amt)"
            reduxId="insuranceFixedUpfront"
            hint="Upfront"
            typeVal="float"
            limit="900000000"
            textBody={formDataReducer.insuranceFixedUpfront}
            // onTextInputChange={this.handleTextChange}
          />
          <TextField
            id="Insurance (fixed amt)"
            reduxId="insuranceFixedOngoing"
            hint="Ongoing"
            typeVal="float"
            limit="900000000"
            textBody={formDataReducer.insuranceFixedOngoing}
            // onTextInputChange={this.handleTextChange}
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
            // onTextInputChange={this.handleTextChange}
          />
          <TextField
            id="Security Deposit %"
            reduxId="securityDepositPercentOngoing"
            hint="Ongoing"
            typeVal="float"
            limit="100"
            textBody={formDataReducer.securityDepositPercentOngoing}
            // onTextInputChange={this.handleTextChange}
          />
          <TextField
            id="Security Deposit (fixed amt)"
            reduxId="securityDepositFixedUpfront"
            hint="Upfront"
            typeVal="float"
            limit="900000000"
            textBody={formDataReducer.securityDepositFixedUpfront}
            // onTextInputChange={this.handleTextChange}
          />
          <TextField
            id="Security Deposit (fixed amt)"
            reduxId="securityDepositFixedOngoing"
            hint="Ongoing"
            typeVal="float"
            limit="900000000"
            textBody={formDataReducer.securityDepositFixedOngoing}
            // onTextInputChange={this.handleTextChange}
          />
          <TextField
            id="Interest Paid on Deposit"
            reduxId="interestPaidOnDepositPercent"
            typeVal="float"
            limit="900000000"
            textBody={formDataReducer.interestPaidOnDepositPercent}
            // onTextInputChange={this.handleTextChange}
          />
        </Form>

        <Button name="Back" url={this.state.back} />
        <Button
          name="Next"
          disable={!this.inputsEntered()}
          url={'output'}
          onClickHandler={e => {
            this.postData()
          }}
        />
      </Grid>
    )
  }
}

export default APRInputs
