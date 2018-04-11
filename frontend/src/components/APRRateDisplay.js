// @flow
import React, { Component, View, StyleSheet } from 'react'
import { Link } from 'react-router-dom'
import { Dropdown, Button, TextField } from './'
import { Grid, Jumbotron, PageHeader, Form } from 'react-bootstrap'
import Bootstrap from 'react-bootstrap'
import './../styles/app.scss'
import axios from 'axios'
import ReactTable from 'react-table'
import 'react-table/react-table.css'

class APRRateDisplay extends Component {
  constructor(props) {
    super(props)
    this.state = {
      partner_names: [],
      data: [
        { partner: 'Google' },
        { partner: 'Facebook' },
        { partner: 'Amazon' },
        { partner: 'Uber' }
      ]
    }
  }
  saveData() {
    const { formDataReducer, changedFormData } = this.props
    let data = {
      partner_name: formDataReducer.mfi[0],
      loan_theme: formDataReducer.loanType[0],
      product_type: formDataReducer.productType[0],
      version_num: '1',
      update_name: formDataReducer.startName[0],
      start_name: formDataReducer.startName[0],
      nominal_apr: formDataReducer.aprRate,
      installment_time_period: formDataReducer.installmentTimePeriod[0],
      repayment_type: formDataReducer.repaymentType[0],
      interest_time_period: formDataReducer.interestTimePeriod[0],
      interest_payment_type: formDataReducer.interestPaymentType[0],
      interest_calculation_type: formDataReducer.interestCalculationType[0],
      loan_amount: formDataReducer.loanAmount[0],
      installment: formDataReducer.installment[0],
      nominal_interest_rate: formDataReducer.nominalInterestRate[0],
      grace_period_principal: formDataReducer.gracePeriodPrincipal[0],
      grace_period_interest_pay: formDataReducer.gracePeriodInterestPay[0],
      grace_period_interest_calculate:
        formDataReducer.gracePeriodInterestCalculate[0],
      grace_period_balloon: formDataReducer.gracePeriodBalloon[0],
      fee_percent_upfront: formDataReducer.feePercentUpfront[0],
      fee_percent_ongoing: formDataReducer.feePercentOngoing[0],
      fee_fixed_upfront: formDataReducer.feeFixedUpfront[0],
      fee_fixed_ongoing: formDataReducer.feeFixedOngoing[0],
      tax_percent_fees: formDataReducer.taxPercentFees[0],
      tax_percent_interest: formDataReducer.taxPercentInterest[0],
      insurance_percent_upfront: formDataReducer.insurancePercentUpfront[0],
      insurance_percent_ongoing: formDataReducer.insurancePercentOngoing[0],
      insurance_fixed_upfront: formDataReducer.insuranceFixedUpfront[0],
      insurance_fixed_ongoing: formDataReducer.insuranceFixedOngoing[0],
      security_deposit_percent_upfront:
        formDataReducer.securityDepositPercentUpfront[0],
      security_deposit_percent_ongoing:
        formDataReducer.securityDepositPercentOngoing[0],
      security_deposit_fixed_upfront:
        formDataReducer.securityDepositFixedUpfront[0],
      security_deposit_fixed_ongoing:
        formDataReducer.securityDepositFixedOngoing[0],
      interest_paid_on_deposit_percent:
        formDataReducer.interestPaidOnDepositPercent[0]
    }
    axios
      .post('http://127.0.0.1:3453/saveNewLoan', data)
      .then(response => {
        console.log(response)
      })
      .catch(function(error) {
        console.log(error.message + ' there was an error with the request')
      })
  }

  render() {
    const { formDataReducer, contNewLoan, changedFormData } = this.props
    return (
      <Grid>
        <PageHeader> APR Rate: {formDataReducer.aprRate}%</PageHeader>
        <Button
          name="Submit"
          url=""
          onClickHandler={() => {
            this.saveData()
          }}
        />
        <a href="output.csv" download>
          <button onclick="createCsv()">Download CSV</button>
        </a>
        <br />
        <Button name="Cancel" url="form0" />
        <Button name="Edit" />
        <ReactTable
          columns={[
            {
              Header: 'Period Number',
              accessor: 'period_num',
              Cell: this.renderEditable
            },
            {
              Header: 'Payment Due Date',
              accessor: 'payment_due_date',
              Cell: this.renderEditable
            },
            {
              Header: 'Days',
              accessor: 'days',
              Cell: this.renderEditable
            },
            {
              Header: 'Amount Due',
              accessor: 'amount_due',
              Cell: this.renderEditable
            },
            {
              Header: 'Principal Payment',
              accessor: 'principal_payment',
              Cell: this.renderEditable
            },
            {
              Header: 'Interest',
              accessor: 'interest',
              Cell: this.renderEditable
            },
            {
              Header: 'Fees',
              accessor: 'fees',
              Cell: this.renderEditable
            },
            {
              Header: 'Insurance',
              accessor: 'insurance',
              Cell: this.renderEditable
            },
            {
              Header: 'Taxes',
              accessor: 'taxes',
              Cell: this.renderEditable
            },
            {
              Header: 'Security Deposit',
              accessor: 'security_deposit',
              Cell: this.renderEditable
            },
            {
              Header: 'Security Interest Paid',
              accessor: 'security_interest_paid',
              Cell: this.renderEditable
            },
            {
              Header: 'Balance',
              accessor: 'balance',
              Cell: this.renderEditable
            },
            {
              Header: 'Deposit Balance',
              accessor: 'deposit_balance',
              Cell: this.renderEditable
            }
          ]}
        />
      </Grid>
    )
  }
}

export default APRRateDisplay
