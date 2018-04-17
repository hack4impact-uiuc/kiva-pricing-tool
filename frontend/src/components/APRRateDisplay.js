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
      // data: this.convertMatrix(),
      data: []
    }
    // this.convertMatrix = this.convertMatrix.bind(this)
    this.renderEditable = this.renderEditable.bind(this)
    this.updateTable = this.updateTable.bind(this)
  }
  // convertMatrix() {
  //   const { formDataReducer, contNewLoan, changedFormData } = this.props
  //   let reformatted_matrix = []
  //   console.log(formDataReducer.aprRate)
  //   console.log(formDataReducer.original_repayment_schedule)
  //   if (formDataReducer.original_repayment_schedule != null){
  //     for (let i = 0; i < formDataReducer.original_repayment_schedule[0].length; i++){
  //       reformatted_matrix.push({
  //         period_num: formDataReducer.original_repayment_schedule[0][i],
  //         payment_due_date: formDataReducer.original_repayment_schedule[1][i],
  //         days: formDataReducer.original_repayment_schedule[2][i],
  //         amount_due: formDataReducer.original_repayment_schedule[3][i],
  //         principal_payment: formDataReducer.original_repayment_schedule[4][i],
  //         interest: formDataReducer.original_repayment_schedule[5][i],
  //         fees: formDataReducer.original_repayment_schedule[6][i],
  //         insurance: formDataReducer.original_repayment_schedule[7][i],
  //         taxes: formDataReducer.original_repayment_schedule[8][i],
  //         security_deposit: formDataReducer.original_repayment_schedule[9][i],
  //         security_interest_paid: formDataReducer.original_repayment_schedule[10][i],
  //         balance: formDataReducer.original_repayment_schedule[11][i],
  //         deposit_balance: formDataReducer.original_repayment_schedule[12][i]
  //       })
  //     }
  //   }
  //   return reformatted_matrix
  // }
  updateTable(e, cellInfo) {
    const { formDataReducer, contNewLoan, changedFormData } = this.props
    if (
      formDataReducer.original_repayment_schedule[cellInfo.index][
        cellInfo.column.id
      ] !==
      formDataReducer.user_repayment_schedule[cellInfo.index][
        cellInfo.column.id
      ]
    ) {
      let inputs = {
        partner_name: formDataReducer.mfi[0],
        loan_theme: formDataReducer.loanType[0],
        product_type: formDataReducer.productType[0],
        version_num: formDataReducer.versionNum[0],
        update_name: formDataReducer.updateName,
        start_name: formDataReducer.startName[0],
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
      let user_change = [[], [], [], [], [], [], [], [], [], [], [], [], []]
      for (let i = 0; i < formDataReducer.calc_repayment_schedule.length; i++) {
        user_change[0].push(
          formDataReducer.calc_repayment_schedule[i]['period_num']
        )
        user_change[1].push(
          formDataReducer.calc_repayment_schedule[i]['payment_due_date']
        )
        user_change[2].push(formDataReducer.calc_repayment_schedule[i]['days'])
        user_change[3].push(
          formDataReducer.calc_repayment_schedule[i]['amount_due']
        )
        user_change[4].push(
          formDataReducer.calc_repayment_schedule[i]['principal_payment']
        )
        user_change[5].push(
          formDataReducer.calc_repayment_schedule[i]['interest']
        )
        user_change[6].push(formDataReducer.calc_repayment_schedule[i]['fees'])
        user_change[7].push(
          formDataReducer.calc_repayment_schedule[i]['insurance']
        )
        user_change[8].push(formDataReducer.calc_repayment_schedule[i]['taxes'])
        user_change[9].push(
          formDataReducer.calc_repayment_schedule[i]['security_deposit']
        )
        user_change[10].push(
          formDataReducer.calc_repayment_schedule[i]['security_interest_paid']
        )
        user_change[11].push(
          formDataReducer.calc_repayment_schedule[i]['balance']
        )
        user_change[12].push(
          formDataReducer.calc_repayment_schedule[i]['deposit_balance']
        )
      }
      let data = {
        inputs: inputs,
        user_change: user_change
      }
      axios.post('http://127.0.0.1:3453/recalculate', data).then(response => {
        const apr = response.data.result.apr
        const recal_matrix = response.data.result.recal_matrix
        changedFormData('aprRate', apr)
        let calc_matrix = []
        if (recal_matrix != null) {
          for (let i = 0; i < recal_matrix[0].length; i++) {
            calc_matrix.push({
              period_num: recal_matrix[0][i],
              payment_due_date: recal_matrix[1][i],
              days: recal_matrix[2][i],
              amount_due: recal_matrix[3][i],
              principal_payment: recal_matrix[4][i],
              balance: recal_matrix[5][i],
              interest: recal_matrix[6][i],
              fees: recal_matrix[7][i],
              insurance: recal_matrix[8][i],
              taxes: recal_matrix[9][i],
              security_deposit: recal_matrix[10][i],
              security_interest_paid: recal_matrix[11][i],
              deposit_balance: recal_matrix[12][i]
            })
          }
        }
        calc_matrix[0]['period_num'] = 'Disbursement Info'
        changedFormData('calc_repayment_schedule', calc_matrix)
      })
    }
  }
  renderEditable(cellInfo) {
    const { formDataReducer, contNewLoan, changedFormData } = this.props
    let editable =
      cellInfo.column.id !== 'period_num' &&
      cellInfo.column.id !== 'amount_due' &&
      cellInfo.column.id !== 'balance' &&
      cellInfo.column.id !== 'security_deposit' &&
      cellInfo.column.id !== 'security_interest_paid' &&
      cellInfo.column.id !== 'deposit_balance'
    return (
      <div
        style={
          editable
            ? { backgroundColor: '#fafafa' }
            : { backgroundColor: '#eaeaea' }
        }
        contentEditable={editable}
        suppressContentEditableWarning
        onBlur={e => {
          // this.updateTable(e, cellInfo)
          console.log(cellInfo)
          console.log(e)
          if (
            formDataReducer.user_repayment_schedule[cellInfo.index][
              cellInfo.column.id
            ] !== e.target.innerHTML
          ) {
            formDataReducer.user_repayment_schedule[cellInfo.index][
              cellInfo.column.id
            ] =
              e.target.innerHTML
            console.log('abc')
          }
        }}
        // onInput={e => {
        //   console.log(formDataReducer.user_repayment_schedule)
        //   formDataReducer.user_repayment_schedule[cellInfo.index][cellInfo.column.id] = e.target.innerHTML
        // }}
        dangerouslySetInnerHTML={{
          __html:
            formDataReducer.user_repayment_schedule[cellInfo.index][
              cellInfo.column.id
            ]
        }}
      />
    )
  }
  getCSV() {
    axios
      .get('http://127.0.0.1:3453/getCSV')
      .then(response => {
        console.log(response)
        // aprRate: apr,
        // saveData: data
      })
      .catch(function(error) {
        console
          .log
          // error + ' there was an error with the request' + data.start_name
          ()
      })
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
        <Button
          name="Download CSV"
          onClickHandler={() => {
            this.getCSV()
          }}
          disable={true}
        />
        <br />
        <Button name="Cancel" url="" />
        <Button name="Edit" url="form1" />
        <ReactTable
          data={formDataReducer.original_repayment_schedule}
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
              Header: 'Balance',
              accessor: 'balance',
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
