// @flow
import React, { Component } from 'react'
import { Dropdown, Button, TextField } from './'
import { Grid, PageHeader, Row, Col } from 'react-bootstrap'
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
    return input === null || input.length === 0
  }

  postData() {
    const { formDataReducer, changedFormData } = this.props
    this.inputsEntered() &&
      Api.postData(formDataReducer).then(r => {
        changedFormData('nominalApr', r.apr)
        const matrix = r.matrix
        let reformatted_matrix = []
        let user_matrix = []
        let calc_matrix = []
        if (matrix != null) {
          for (let i = 0; i < matrix[0].length; i++) {
            reformatted_matrix.push({
              period_num: matrix[0][i],
              payment_due_date: matrix[1][i],
              days: matrix[2][i],
              amount_due: matrix[3][i],
              principal_payment: matrix[4][i],
              balance: matrix[5][i],
              interest: matrix[6][i],
              fees: matrix[7][i],
              insurance: matrix[8][i],
              taxes: matrix[9][i],
              security_deposit: matrix[10][i],
              security_interest_paid: matrix[11][i],
              deposit_withdrawal: matrix[12][i],
              deposit_balance: matrix[13][i],
              total_cashflow: matrix[14][i]
            })
            user_matrix.push({
              period_num: null,
              payment_due_date: null,
              days: null,
              amount_due: null,
              principal_payment: null,
              balance: null,
              interest: null,
              fees: null,
              insurance: null,
              taxes: null,
              security_deposit: null,
              security_interest_paid: null,
              deposit_withdrawal: null,
              deposit_balance: null,
              total_cashflow: null
            })
            calc_matrix.push({
              period_num: matrix[0][i],
              payment_due_date: matrix[1][i],
              days: matrix[2][i],
              amount_due: matrix[3][i],
              principal_payment: matrix[4][i],
              balance: matrix[5][i],
              interest: matrix[6][i],
              fees: matrix[7][i],
              insurance: matrix[8][i],
              taxes: matrix[9][i],
              security_deposit: matrix[10][i],
              security_interest_paid: matrix[11][i],
              deposit_withdrawal: matrix[12][i],
              deposit_balance: matrix[13][i],
              total_cashflow: matrix[14][i]
            })
          }
        }
        reformatted_matrix[0]['period_num'] = 'Disbursement Info'
        calc_matrix[0]['period_num'] = 'Disbursement Info'
        console.log(reformatted_matrix)
        changedFormData('original_repayment_schedule', reformatted_matrix)
        changedFormData('user_repayment_schedule', user_matrix)
        changedFormData('calc_repayment_schedule', calc_matrix)
        changedFormData('new_repayment_schedule', matrix)
        changedFormData('back', 'form1')
      })
  }

  render() {
    const { formDataReducer } = this.props
    // console.log('hello' + this.state.back)
    return (
      <div className="page-body-grey padded-element-vertical overpad-shrink">
        <Grid
          fluid
          className="screen-horizontal-centered screen-vertical-centered-grid padded-element-all round-corners-large solid-background"
        >
          <Row>
            <Row>
              <Col sm={12} md={12}>
                <PageHeader>User Information</PageHeader>
              </Col>
            </Row>
            <Row>
              <Col sm={12} md={12}>
                <TextField
                  className="inline-textfield"
                  id="Full Name"
                  reduxId="startName"
                  hint="ex. John"
                  typeVal="String"
                  limit="100"
                  textBody={formDataReducer.startName}
                />
              </Col>
            </Row>
          </Row>

          <Row>
            <Row>
              <Col sm={12} md={12}>
                <PageHeader>Basic Loan Conditions</PageHeader>
              </Col>
            </Row>
            <Row>
              <Col sm={4} md={4} className="bs-center">
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
                      ? formDataReducer.repaymentType
                      : null
                  }
                />
              </Col>
              <Col sm={4} md={4} className="bs-center">
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
                      ? formDataReducer.interestPaymentType
                      : null
                  }
                />
              </Col>
              <Col sm={4} md={4} className="bs-center">
                <Dropdown
                  title="Interest Calculation:"
                  reduxId="interestCalculationType"
                  items={[
                    { id: '1', value: 'initial amount or flat' },
                    // { id: '2', value: 'Flat' },
                    { id: '2', value: 'declining balance' }
                  ]}
                  onTextInputChange={this.handleTextChange}
                  selected={
                    formDataReducer.interestCalculationType
                      ? formDataReducer.interestCalculationType
                      : null
                  }
                />
              </Col>
            </Row>
            <Row className="vertical-margin-item flex-align-center">
              <Col sm={4} md={4}>
                <TextField
                  id="Loan Amount"
                  reduxId="loanAmount"
                  hint="ex. 5000"
                  typeVal="float"
                  limit="900000000"
                  textBody={formDataReducer.loanAmount}
                />
              </Col>
              <Col sm={2} md={2} className="bs-center">
                <div>
                  <p className="vertical-margin-item">Paid Over: </p>
                </div>
              </Col>
              <Col sm={4} md={4}>
                <TextField
                  id="Number of Installments"
                  reduxId="installment"
                  hint="ex. 12"
                  typeVal="int"
                  limit="180"
                  textBody={formDataReducer.installment}
                />
              </Col>
              <Col sm={2} md={2} className="bs-center">
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
                      ? formDataReducer.installmentTimePeriod
                      : null
                  }
                />
              </Col>
            </Row>
            <Row className="vertical-margin-item flex-align-center">
              <Col sm={6} md={6}>
                <TextField
                  id="Nominal Interest Rate"
                  reduxId="nominalInterestRate"
                  hint="ex. 12"
                  typeVal="int"
                  limit="100"
                  textBody={formDataReducer.nominalInterestRate}
                />
              </Col>
              <Col sm={2} md={2} className="bs-center">
                <div>
                  <p className="vertical-margin-item">Every: </p>
                </div>
              </Col>
              <Col sm={4} md={4}>
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
                      ? formDataReducer.interestTimePeriod
                      : null
                  }
                />
              </Col>
            </Row>

            <Row className="vertical-margin-item">
              <Col sm={3} md={3}>
                <TextField
                  id="Grace and Prepay"
                  reduxId="gracePeriodPrincipal"
                  hint="Capital"
                  typeVal="float"
                  limit="180"
                  textBody={formDataReducer.gracePeriodPrincipal}
                />
              </Col>
              <Col sm={3} md={3}>
                <TextField
                  className="preserve-id"
                  id=""
                  reduxId="gracePeriodInterestPay"
                  hint="Int Pmt"
                  typeVal="float"
                  limit="180"
                  textBody={formDataReducer.gracePeriodInterestPay}
                />
              </Col>
              <Col sm={3} md={3}>
                <TextField
                  className="preserve-id"
                  id=""
                  reduxId="gracePeriodInterestCalculate"
                  hint="Int Calc"
                  typeVal="float"
                  limit="180"
                  textBody={formDataReducer.gracePeriodInterestCalculate}
                />
              </Col>
              <Col sm={3} md={3}>
                <TextField
                  className="preserve-id"
                  id=""
                  reduxId="gracePeriodBalloon"
                  hint="Balloon"
                  typeVal="float"
                  limit="180"
                  textBody={formDataReducer.gracePeriodBalloon}
                />
              </Col>
            </Row>
          </Row>
          <Row>
            <Row>
              <Col sm={12} md={12}>
                <PageHeader>Fees</PageHeader>
              </Col>
            </Row>
            <Row>
              <Col sm={6} md={6} className="bs-button-right">
                <TextField
                  className="inline-textfield"
                  id="Fee%"
                  reduxId="feePercentUpfront"
                  hint="Upfront"
                  typeVal="float"
                  limit="180"
                  textBody={formDataReducer.feePercentUpfront}
                />
              </Col>
              <Col sm={6} md={6}>
                <TextField
                  className="inline-textfield"
                  reduxId="feePercentOngoing"
                  hint="Ongoing"
                  typeVal="float"
                  limit="180"
                  textBody={formDataReducer.feePercentOngoing}
                />
              </Col>
            </Row>
            <Row>
              <Col sm={6} md={6} className="bs-button-right">
                <TextField
                  className="inline-textfield"
                  id="Fee (fixed amt)"
                  reduxId="feeFixedUpfront"
                  hint="Upfront"
                  typeVal="float"
                  limit="100000000"
                  textBody={formDataReducer.feeFixedUpfront}
                />
              </Col>
              <Col sm={6} md={6}>
                <TextField
                  className="inline-textfield"
                  reduxId="feeFixedOngoing"
                  hint="Ongoing"
                  typeVal="float"
                  limit="100000000"
                  textBody={formDataReducer.feeFixedOngoing}
                />
              </Col>
            </Row>
          </Row>
          <Row>
            <Row>
              <Col sm={12} md={12}>
                <PageHeader>Taxes</PageHeader>
              </Col>
            </Row>
            <Row>
              <Col sm={6} md={6} className="bs-button-right">
                <TextField
                  className="inline-textfield placeholder-textfield"
                  id="On Fees"
                  hint="PLACEHOLDER"
                />
              </Col>
              <Col sm={6} md={6}>
                <TextField
                  className="inline-textfield"
                  hint="Ongoing %"
                  reduxId="taxPercentFees"
                  typeVal="float"
                  limit="100"
                  textBody={formDataReducer.taxPercentFees}
                />
              </Col>
            </Row>
            <Row>
              <Col sm={6} md={6} className="bs-button-right">
                <TextField
                  className="inline-textfield placeholder-textfield"
                  id="On Interest"
                  hint="PLACEHOLDER"
                />
              </Col>
              <Col sm={6} md={6}>
                <TextField
                  className="inline-textfield"
                  hint="Ongoing %"
                  reduxId="taxPercentInterest"
                  typeVal="float"
                  limit="100"
                  textBody={formDataReducer.taxPercentInterest}
                />
              </Col>
            </Row>
          </Row>

          <Row>
            <Row>
              <Col sm={12} md={12}>
                <PageHeader>Insurance</PageHeader>
              </Col>
            </Row>
            <Row>
              <Col sm={6} md={6} className="bs-button-right">
                <TextField
                  className="inline-textfield"
                  id="Insurance %"
                  reduxId="insurancePercentUpfront"
                  hint="Upfront"
                  typeVal="float"
                  limit="100"
                  textBody={formDataReducer.insurancePercentUpfront}
                />
              </Col>
              <Col sm={6} md={6}>
                <TextField
                  className="inline-textfield"
                  reduxId="insurancePercentOngoing"
                  hint="Ongoing"
                  typeVal="float"
                  limit="100"
                  textBody={formDataReducer.insurancePercentOngoing}
                />
              </Col>
            </Row>
            <Row>
              <Col sm={6} md={6} className="bs-button-right">
                <TextField
                  className="inline-textfield"
                  id="Insurance (fixed amt)"
                  reduxId="insuranceFixedUpfront"
                  hint="Upfront"
                  typeVal="float"
                  limit="900000000"
                  textBody={formDataReducer.insuranceFixedUpfront}
                />
              </Col>
              <Col sm={6} md={6}>
                <TextField
                  className="inline-textfield"
                  reduxId="insuranceFixedOngoing"
                  hint="Ongoing"
                  typeVal="float"
                  limit="900000000"
                  textBody={formDataReducer.insuranceFixedOngoing}
                />
              </Col>
            </Row>
          </Row>

          <Row>
            <Row>
              <Col sm={12} md={12}>
                <PageHeader>Security Deposit</PageHeader>
              </Col>
            </Row>
            <Row>
              <Col sm={6} md={6} className="bs-button-right">
                <TextField
                  className="inline-textfield"
                  id="Security Deposit %"
                  reduxId="securityDepositPercentUpfront"
                  hint="Upfront"
                  typeVal="float"
                  limit="100"
                  textBody={formDataReducer.securityDepositPercentUpfront}
                />
              </Col>
              <Col sm={6} md={6}>
                <TextField
                  className="inline-textfield"
                  reduxId="securityDepositPercentOngoing"
                  hint="Ongoing"
                  typeVal="float"
                  limit="100"
                  textBody={formDataReducer.securityDepositPercentOngoing}
                />
              </Col>
            </Row>
            <Row>
              <Col sm={6} md={6} className="bs-button-right">
                <TextField
                  className="inline-textfield"
                  id="Security Deposit (fixed amt)"
                  reduxId="securityDepositFixedUpfront"
                  hint="Upfront"
                  typeVal="float"
                  limit="900000000"
                  textBody={formDataReducer.securityDepositFixedUpfront}
                />
              </Col>
              <Col sm={6} md={6}>
                <TextField
                  className="inline-textfield"
                  reduxId="securityDepositFixedOngoing"
                  hint="Ongoing"
                  typeVal="float"
                  limit="900000000"
                  textBody={formDataReducer.securityDepositFixedOngoing}
                />
              </Col>
            </Row>
            <Row>
              <Col sm={6} md={6} className="bs-button-right">
                <TextField
                  className="inline-textfield placeholder-textfield"
                  id="Interest Paid on Deposit"
                  hint="PLACEHOLDER"
                />
              </Col>
              <Col sm={6} md={6}>
                <TextField
                  className="inline-textfield"
                  reduxId="interestPaidOnDepositPercent"
                  hint="Ongoing %"
                  typeVal="float"
                  limit="900000000"
                  textBody={formDataReducer.interestPaidOnDepositPercent}
                />
              </Col>
            </Row>
          </Row>

          <Row className="vertical-margin-item">
            <Col xs={6} sm={6} md={6}>
              <Button
                className="button-fancy"
                name="Back"
                url={this.state.back}
              />
            </Col>
            <Col xs={6} sm={6} md={6} className="bs-button-right">
              <Button
                className="button-fancy"
                name="Next"
                disable={!this.inputsEntered()}
                url={'output'}
                onClickHandler={e => {
                  this.postData()
                }}
              />
            </Col>
          </Row>
        </Grid>
      </div>
    )
  }
}

export default APRInputs
