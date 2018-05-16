// @flow
import React, { Component, View, StyleSheet } from 'react'
import { Link } from 'react-router-dom'
import { Grid, PageHeader, Row, Col } from 'react-bootstrap'
import { Button, KivaChart } from './'
import { Api } from '../utils'
import './../styles/app.css'
import axios from 'axios'
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import Switch from 'react-switch'

class APRRateDisplay extends Component {
  constructor(props) {
    super(props)
    this.state = {
      id: null,
      partner_names: [],
      visualType: 'Bar',
      chartID: "Payment Chart",
      changeChart: false,
      changeVisual: false,
      isHidden: false,
      data: [],
      testData: [
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        [
          '1-Jan-2012',
          '2-Jan-2012',
          '3-Jan-2012',
          '4-Jan-2012',
          '5-Jan-2012',
          '6-Jan-2012',
          '7-Jan-2012',
          '8-Jan-2012',
          '9-Jan-2012',
          '10-Jan-2012',
          '11-Jan-2012',
          '12-Jan-2012',
          '13-Jan-2012'
        ],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [5000, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [
          5000,
          5000,
          5000,
          5000,
          5000,
          5000,
          5000,
          5000,
          5000,
          5000,
          5000,
          0,
          0
        ],
        [0, 0, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 0],
        [51, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [51, 51, 51, 51, 51, 51, 51, 51, 51, 51, 51, 0, 0],
        [
          0.51,
          0.01,
          6.01,
          6.01,
          6.01,
          6.01,
          6.01,
          6.01,
          6.01,
          6.01,
          6.01,
          6.01,
          0
        ],
        [51, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
        [
          0,
          0.0013972602739726028,
          0.001424695815349972,
          0.0014521321083860088,
          0.0014795691531013073,
          0.0015070069495164607,
          0.0015344454976520638,
          0.0015618847975287118,
          0.0015893248491670002,
          0.0016167656525875253,
          0.001644207207810884,
          0.0016716495148576733,
          0
        ],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 61.01687894181993],
        [
          51,
          52.001397260273976,
          53.00282195608932,
          54.00427408819771,
          55.00575365735081,
          56.007260664300325,
          57.00879510979798,
          58.010356994595504,
          59.011946319444675,
          60.01356308509726,
          61.01520729230507,
          61.01687894181993,
          0
        ],
        [
          4846.49,
          -53.01,
          -659.01,
          -659.01,
          -659.01,
          -659.01,
          -659.01,
          -659.01,
          -659.01,
          -659.01,
          -659.01,
          -545.99312105818,
          0
        ]
      ]
    }
    this.renderEditable = this.renderEditable.bind(this)
    this.updateTable = this.updateTable.bind(this)
    this.ModifyEnterKeyPressAsTab = this.ModifyEnterKeyPressAsTab.bind(this)
  }

  updateTable = (e, cellInfo) => {
    const { formDataReducer, changedFormData } = this.props
    if (
      formDataReducer.calc_repayment_schedule[cellInfo.index][
        cellInfo.column.id
      ].toString() !== e.target.innerHTML
    ) {
      if (e.target.innerHTML === null || e.target.innerHTML.trim() === '') {
        formDataReducer.user_repayment_schedule[cellInfo.index][
          cellInfo.column.id
        ] = null
        formDataReducer.calc_repayment_schedule[cellInfo.index][
          cellInfo.column.id
        ] = null
      } else {
        formDataReducer.user_repayment_schedule[cellInfo.index][
          cellInfo.column.id
        ] =
          e.target.innerHTML
      }
      let user_change = [
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        []
      ]
      for (
        let i = 0;
        i < formDataReducer.user_repayment_schedule.length - 1;
        i++
      ) {
        user_change[0].push(
          formDataReducer.user_repayment_schedule[i]['period_num']
        )
        user_change[1].push(
          formDataReducer.user_repayment_schedule[i]['payment_due_date']
        )
        user_change[2].push(formDataReducer.user_repayment_schedule[i]['days'])
        user_change[3].push(
          formDataReducer.user_repayment_schedule[i]['amount_due']
        )
        user_change[4].push(
          formDataReducer.user_repayment_schedule[i]['principal_payment']
        )
        user_change[5].push(
          formDataReducer.user_repayment_schedule[i]['balance']
        )
        user_change[6].push(
          formDataReducer.user_repayment_schedule[i]['interest']
        )
        user_change[7].push(formDataReducer.user_repayment_schedule[i]['fees'])
        user_change[8].push(
          formDataReducer.user_repayment_schedule[i]['insurance']
        )
        user_change[9].push(formDataReducer.user_repayment_schedule[i]['taxes'])
        user_change[10].push(
          formDataReducer.user_repayment_schedule[i]['security_deposit']
        )
        user_change[11].push(
          formDataReducer.user_repayment_schedule[i]['security_interest_paid']
        )
        user_change[12].push(
          formDataReducer.user_repayment_schedule[i]['deposit_withdrawal']
        )
        user_change[13].push(
          formDataReducer.user_repayment_schedule[i]['deposit_balance']
        )
        user_change[14].push(
          formDataReducer.user_repayment_schedule[i]['total_cashflow']
        )
      }
      let data = {
        user_change: user_change
      }
      Api.recalculate(data, formDataReducer)
      axios.post('http://127.0.0.1:3453/recalculate', data).then(response => {
        const apr = response.data.result.apr
        const recal_matrix = response.data.result.recal_matrix
        changedFormData('nominalApr', apr)
        changedFormData('new_repayment_schedule', recal_matrix)
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
              deposit_withdrawal: recal_matrix[12][i],
              deposit_balance: recal_matrix[13][i],
              total_cashflow: recal_matrix[14][i]
            })
          }
          calc_matrix.push({
            period_num: 'Total',
            payment_due_date: ' ',
            days: 0,
            amount_due: 0,
            principal_payment: 0,
            balance: ' ',
            interest: 0,
            fees: 0,
            insurance: 0,
            taxes: 0,
            security_deposit: 0,
            security_interest_paid: 0,
            deposit_withdrawal: 0,
            deposit_balance: ' ',
            total_cashflow: 0
          })
          let last = calc_matrix.length - 1
          for (let i = 0; i < last; i++) {
            calc_matrix[last]['days'] += calc_matrix[i]['days']
            calc_matrix[last]['amount_due'] += calc_matrix[i]['amount_due']
            calc_matrix[last]['principal_payment'] +=
              calc_matrix[i]['principal_payment']
            calc_matrix[last]['interest'] += calc_matrix[i]['interest']
            calc_matrix[last]['fees'] += calc_matrix[i]['fees']
            calc_matrix[last]['insurance'] += calc_matrix[i]['insurance']
            calc_matrix[last]['taxes'] += calc_matrix[i]['taxes']
            calc_matrix[last]['security_deposit'] +=
              calc_matrix[i]['security_deposit']
            calc_matrix[last]['security_interest_paid'] +=
              calc_matrix[i]['security_interest_paid']
            calc_matrix[last]['deposit_withdrawal'] +=
              calc_matrix[i]['deposit_withdrawal']
            calc_matrix[last]['total_cashflow'] +=
              calc_matrix[i]['total_cashflow']
          }
          calc_matrix[last]['principal_payment'] = calc_matrix[last][
            'principal_payment'
          ].toFixed(2)
          calc_matrix[last]['interest'] = calc_matrix[last]['interest'].toFixed(
            2
          )
          calc_matrix[last]['fees'] = calc_matrix[last]['fees'].toFixed(2)
          calc_matrix[last]['insurance'] = calc_matrix[last][
            'insurance'
          ].toFixed(2)
          calc_matrix[last]['taxes'] = calc_matrix[last]['taxes'].toFixed(2)
          calc_matrix[last]['security_deposit'] = calc_matrix[last][
            'security_deposit'
          ].toFixed(2)
          calc_matrix[last]['security_interest_paid'] = calc_matrix[last][
            'security_interest_paid'
          ].toFixed(2)
          calc_matrix[last]['deposit_withdrawal'] = calc_matrix[last][
            'deposit_withdrawal'
          ].toFixed(2)
          calc_matrix[last]['total_cashflow'] = calc_matrix[last][
            'total_cashflow'
          ].toFixed(2)
        }
        calc_matrix[0]['period_num'] = 'Disbursement Info'
        changedFormData('calc_repayment_schedule', calc_matrix)
      })
      this.createChart.bind(this)
    }
  }
  renderEditable = event => {
    const { formDataReducer } = this.props
    let editable =
      event.column.id !== 'period_num' &&
      event.column.id !== 'amount_due' &&
      event.column.id !== 'balance' &&
      event.column.id !== 'deposit_withdrawal' &&
      event.column.id !== 'security_interest_paid' &&
      event.column.id !== 'deposit_balance' &&
      event.column.id !== 'total_cashflow' &&
      formDataReducer.calc_repayment_schedule[event.index]['period_num'] !==
        'Total'
    let total =
      formDataReducer.calc_repayment_schedule[event.index]['period_num'] ===
        'Total' ||
      formDataReducer.calc_repayment_schedule[event.index]['period_num'] ===
        'Disbursement Info'
    return (
      <div
        style={
          total
            ? { backgroundColor: '#fafaba' }
            : !editable
              ? { backgroundColor: '#fafafa' }
              : formDataReducer.user_repayment_schedule[event.index][
                  event.column.id
                ] !== null
                ? { backgroundColor: '#bafaba' }
                : { backgroundColor: '#eaeaea' }
        }
        onKeyDown={e => {
          this.ModifyEnterKeyPressAsTab
          if (e.keyCode === 13) {
            e.preventDefault()
          }
        }}
        contentEditable={editable}
        suppressContentEditableWarning
        onBlur={e => {
          this.updateTable(e, event)
        }}
        dangerouslySetInnerHTML={{
          __html:
            formDataReducer.calc_repayment_schedule[event.index][
              event.column.id
            ]
        }}
      />
    )
  }
  changeVisualType(changeVisual) {
    this.setState({changeVisual})
    if (changeVisual) {
      this.setState({visualType: "Area"})
    }else if (!changeVisual) {
      this.setState({visualType: "Bar"})
    }
  }

  changeChartType(changeChart) {
    this.setState({changeChart})
    if (changeChart) {
      this.setState({chartID: "Balance Chart"})
    }else if (!changeChart) {
      this.setState({chartID: "Payment Chart"})
    }	  
   }

  getCSV() {
    const { formDataReducer } = this.props
    let csv = [
      [
        'Period Number,Date,Days,Principal Disbursed,Principal Paid,Balance,Interest Paid,Fees Paid,Insurance Paid,Taxes Paid,Security Deposit,Interest Paid on Security,Deposit Withdrawal,Deposit Balance,Total Cashflow\n'
      ]
    ]
    let row
    for (let j = 0; j < 13; j++) {
      row = ''
      for (let i = 0; i < 15; i++) {
        row += formDataReducer.new_repayment_schedule[i][j] + ','
      }
      row += '\n'
      csv.push(row)
    }
    row = '\n\n'
    csv.push(row)
    row =
      'APR Rate,Partner Name,Loan Theme,Product Type, Version Num, Update Name, Start Name, Installment Time Period, Repayment Type, Interest Time Period,Interest Payment Type,Interest Calculation Type,Loan Amount,Installment,Nominal Interest Rate,grace period principal,grace period interest payment,grace period interest calculate,grace period balloon,fee percent upfront,fee percent ongoing,fee fixed upfront,fee fixed ongoing,tax percent fees,tax percent interest,insurance percent upfront,insurance percent ongoing,insurance fixed upfront,insurance fixed ongoing,security deposit percent upfront,security deposit percent ongoing,security deposit fixed upfront,security deposit fixed ongoing,interest paid on deposit percent \n'
    csv.push(row)
    row =
      formDataReducer.aprRate +
      ',' +
      formDataReducer.mfi[0] +
      ',' +
      formDataReducer.loanType[0] +
      ',' +
      formDataReducer.productType[0] +
      ',' +
      formDataReducer.versionNum[0] +
      ',' +
      formDataReducer.updateName +
      ',' +
      formDataReducer.startName[0] +
      ',' +
      formDataReducer.installmentTimePeriod[0] +
      ',' +
      formDataReducer.repaymentType[0] +
      ',' +
      formDataReducer.interestTimePeriod[0] +
      ',' +
      formDataReducer.interestPaymentType[0] +
      ',' +
      formDataReducer.interestCalculationType[0] +
      ',' +
      formDataReducer.loanAmount[0] +
      ',' +
      formDataReducer.installment[0] +
      ',' +
      formDataReducer.nominalInterestRate[0] +
      ',' +
      formDataReducer.gracePeriodPrincipal[0] +
      ',' +
      formDataReducer.gracePeriodInterestPay[0] +
      ',' +
      formDataReducer.gracePeriodInterestCalculate[0] +
      ',' +
      formDataReducer.gracePeriodBalloon[0] +
      ',' +
      formDataReducer.feePercentUpfront[0] +
      ',' +
      formDataReducer.feePercentOngoing[0] +
      ',' +
      formDataReducer.feeFixedUpfront[0] +
      ',' +
      formDataReducer.feeFixedOngoing[0] +
      ',' +
      formDataReducer.taxPercentFees[0] +
      ',' +
      formDataReducer.taxPercentInterest[0] +
      ',' +
      formDataReducer.insurancePercentUpfront[0] +
      ',' +
      formDataReducer.insurancePercentOngoing[0] +
      ',' +
      formDataReducer.insuranceFixedUpfront[0] +
      ',' +
      formDataReducer.insuranceFixedOngoing[0] +
      ',' +
      formDataReducer.securityDepositPercentUpfront[0] +
      ',' +
      formDataReducer.securityDepositPercentOngoing[0] +
      ',' +
      formDataReducer.securityDepositFixedUpfront[0] +
      ',' +
      formDataReducer.securityDepositFixedOngoing[0] +
      ',' +
      formDataReducer.interestPaidOnDepositPercent[0]
    csv.push(row)

    let csvFile = new Blob(csv, { type: 'text/csv;charset=utf-8;' })
    let url = URL.createObjectURL(csvFile)
    let createDownloadLink = document.createElement('a')
    createDownloadLink.href = url
    createDownloadLink.setAttribute(
      'download',
      formDataReducer.mfi +
        '_' +
        formDataReducer.loanType +
        '_' +
        formDataReducer.productType +
        '_' +
        formDataReducer.versionNum +
        '.csv'
    )
    createDownloadLink.click()
  }

  createChart() {
    const { formDataReducer } = this.props
    this.setState({ data: formDataReducer.new_repayment_schedule })
    this.setState({ isHidden: true })
  }

  saveData() {
    const { formDataReducer } = this.props
    let orig_matrix = [
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      []
    ]
    let user_change = [
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      []
    ]
    let calc_matrix = [
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      []
    ]

    for (
      let i = 0;
      i < formDataReducer.user_repayment_schedule.length - 1;
      i++
    ) {
      user_change[0].push(
        formDataReducer.user_repayment_schedule[i]['period_num']
      )
      user_change[1].push(
        formDataReducer.user_repayment_schedule[i]['payment_due_date']
      )
      user_change[2].push(formDataReducer.user_repayment_schedule[i]['days'])
      user_change[3].push(
        formDataReducer.user_repayment_schedule[i]['amount_due']
      )
      user_change[4].push(
        formDataReducer.user_repayment_schedule[i]['principal_payment']
      )
      user_change[5].push(formDataReducer.user_repayment_schedule[i]['balance'])
      user_change[6].push(
        formDataReducer.user_repayment_schedule[i]['interest']
      )
      user_change[7].push(formDataReducer.user_repayment_schedule[i]['fees'])
      user_change[8].push(
        formDataReducer.user_repayment_schedule[i]['insurance']
      )
      user_change[9].push(formDataReducer.user_repayment_schedule[i]['taxes'])
      user_change[10].push(
        formDataReducer.user_repayment_schedule[i]['security_deposit']
      )
      user_change[11].push(
        formDataReducer.user_repayment_schedule[i]['security_interest_paid']
      )
      user_change[12].push(
        formDataReducer.user_repayment_schedule[i]['deposit_withdrawal']
      )
      user_change[13].push(
        formDataReducer.user_repayment_schedule[i]['deposit_balance']
      )
      user_change[14].push(
        formDataReducer.user_repayment_schedule[i]['total_cashflow']
      )

      orig_matrix[0].push(
        formDataReducer.original_repayment_schedule[i]['period_num']
      )
      orig_matrix[1].push(
        formDataReducer.original_repayment_schedule[i]['payment_due_date']
      )
      orig_matrix[2].push(
        formDataReducer.original_repayment_schedule[i]['days']
      )
      orig_matrix[3].push(
        formDataReducer.original_repayment_schedule[i]['amount_due']
      )
      orig_matrix[4].push(
        formDataReducer.original_repayment_schedule[i]['principal_payment']
      )
      orig_matrix[5].push(
        formDataReducer.original_repayment_schedule[i]['balance']
      )
      orig_matrix[6].push(
        formDataReducer.original_repayment_schedule[i]['interest']
      )
      orig_matrix[7].push(
        formDataReducer.original_repayment_schedule[i]['fees']
      )
      orig_matrix[8].push(
        formDataReducer.original_repayment_schedule[i]['insurance']
      )
      orig_matrix[9].push(
        formDataReducer.original_repayment_schedule[i]['taxes']
      )
      orig_matrix[10].push(
        formDataReducer.original_repayment_schedule[i]['security_deposit']
      )
      orig_matrix[11].push(
        formDataReducer.original_repayment_schedule[i]['security_interest_paid']
      )
      orig_matrix[12].push(
        formDataReducer.original_repayment_schedule[i]['deposit_withdrawal']
      )
      orig_matrix[13].push(
        formDataReducer.original_repayment_schedule[i]['deposit_balance']
      )
      orig_matrix[14].push(
        formDataReducer.original_repayment_schedule[i]['total_cashflow']
      )

      calc_matrix[0].push(
        formDataReducer.calc_repayment_schedule[i]['period_num']
      )
      calc_matrix[1].push(
        formDataReducer.calc_repayment_schedule[i]['payment_due_date']
      )
      calc_matrix[2].push(formDataReducer.calc_repayment_schedule[i]['days'])
      calc_matrix[3].push(
        formDataReducer.calc_repayment_schedule[i]['amount_due']
      )
      calc_matrix[4].push(
        formDataReducer.calc_repayment_schedule[i]['principal_payment']
      )
      calc_matrix[5].push(formDataReducer.calc_repayment_schedule[i]['balance'])
      calc_matrix[6].push(
        formDataReducer.calc_repayment_schedule[i]['interest']
      )
      calc_matrix[7].push(formDataReducer.calc_repayment_schedule[i]['fees'])
      calc_matrix[8].push(
        formDataReducer.calc_repayment_schedule[i]['insurance']
      )
      calc_matrix[9].push(formDataReducer.calc_repayment_schedule[i]['taxes'])
      calc_matrix[10].push(
        formDataReducer.calc_repayment_schedule[i]['security_deposit']
      )
      calc_matrix[11].push(
        formDataReducer.calc_repayment_schedule[i]['security_interest_paid']
      )
      calc_matrix[12].push(
        formDataReducer.calc_repayment_schedule[i]['deposit_withdrawal']
      )
      calc_matrix[13].push(
        formDataReducer.calc_repayment_schedule[i]['deposit_balance']
      )
      calc_matrix[14].push(
        formDataReducer.calc_repayment_schedule[i]['total_cashflow']
      )
    }
    orig_matrix[0][0] = 0
    calc_matrix[0][0] = 0
    let data = {
      partner_name: formDataReducer.mfi,
      loan_theme: formDataReducer.loanType,
      product_type: formDataReducer.productType,
      version_num: '1',
      update_name: formDataReducer.startName,
      start_name: formDataReducer.startName,
      nominal_apr: formDataReducer.nominalApr,
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
        formDataReducer.securityDepositPercentUpfront,
      security_deposit_percent_ongoing:
        formDataReducer.securityDepositPercentOngoing,
      security_deposit_fixed_upfront:
        formDataReducer.securityDepositFixedUpfront,
      security_deposit_fixed_ongoing:
        formDataReducer.securityDepositFixedOngoing,
      interest_paid_on_deposit_percent:
        formDataReducer.interestPaidOnDepositPercent
    }
    let payload = {
      partner_name: formDataReducer.mfi,
      loan_theme: formDataReducer.loanType,
      product_type: formDataReducer.productType,
      version_num: formDataReducer.versionNum,
      origin_matrix: orig_matrix,
      user_change_matrix: user_change,
      repay_matrix: calc_matrix
    }
    Api.saveLoan(payload, formDataReducer).then(response => {
      console.log(response)
    })
  }

  render() {
    const { formDataReducer } = this.props
    return (
      <Grid fluid className="padded-element-horizontal">
        <Row>
          <Col sm={12} md={12} className="bs-center">
            <PageHeader className="page-header-montserrat bs-center">
              <small>
                {formDataReducer.mfi} | {formDataReducer.loanType} |{' '}
                {formDataReducer.productType} | Version{' '}
                {formDataReducer.versionNum}
              </small>
            </PageHeader>
          </Col>
        </Row>
        <Row>
          <Col sm={12} md={12}>
            <PageHeader className="bs-center">
              {' '}
              APR Rate: {formDataReducer.nominalApr}%
            </PageHeader>
          </Col>
        </Row>
        <Row className="vertical-margin-item">
          <Col sm={8} md={8}>
            {this.state.isHidden && (
              <div>
                <label htmlFor="material-switch">
                <span>{this.state.visualType}</span>
                <Switch
                              onChange={event => this.changeVisualType(event)}
                  checked={this.state.changeVisual}
                  onColor="#438b48"
                  onHandleColor="#c4ccc6"
                  handleDiameter={30}
                  uncheckedIcon={false}
                  checkedIcon={false}
                  className="react-switch"
                  id="material-switch"
                />
                </label>
                <label htmlFor="material-switch">
                <span>{this.state.chartID}</span>
                <Switch
                              onChange={event => this.changeChartType(event)}
                  checked={this.state.changeChart}
                  onColor="#438b48"
                  onHandleColor="#c4ccc6"
                  handleDiameter={30}
                  uncheckedIcon={false}
                  checkedIcon={false}
                  className="react-switch"
                  id="material-switch"
                />
                </label>
                <KivaChart id = {this.state.chartID} visualType={this.state.visualType} data={this.state.data}></KivaChart>			
                    </div>

                        )}
                      </Col>
                      <Col sm={4} md={4}>
                        <Row className="vertical-margin-item">
                          <Col sm={6} md={6}>
                {!this.state.isHidden && (
                            <button
                              className="button-fancy"
                              onClick={this.createChart.bind(this)}
                            >
                              Generate Chart
                            </button>
                )}
              </Col>
              <Col sm={6} md={6} className="bs-button-right">
                <button
                  className="button-fancy"
                  onClick={this.getCSV.bind(this)}
                >
                  Download CSV
                </button>
              </Col>
            </Row>
          </Col>
        </Row>

        <Row>
          <Col sm={12} md={12}>
            <ReactTable
              data={formDataReducer.calc_repayment_schedule}
              columns={[
                {
                  Header: <h5 style={{ color: 'red' }}>Period Number</h5>,
                  accessor: 'period_num',
                  Cell: this.renderEditable
                },
                {
                  Header: <h5 style={{ color: 'red' }}>Payment Due Date</h5>,
                  accessor: 'payment_due_date',
                  Cell: this.renderEditable
                },
                {
                  Header: <h5 style={{ color: 'red' }}>Days</h5>,
                  accessor: 'days',
                  Cell: this.renderEditable
                },
                {
                  Header: <h5 style={{ color: 'red' }}>Amount Due</h5>,
                  accessor: 'amount_due',
                  Cell: this.renderEditable
                },
                {
                  Header: <h5 style={{ color: 'red' }}>Principal Payment</h5>,
                  accessor: 'principal_payment',
                  Cell: this.renderEditable
                },
                {
                  Header: <h5 style={{ color: 'red' }}>Balance</h5>,
                  accessor: 'balance',
                  Cell: this.renderEditable
                },
                {
                  Header: <h5 style={{ color: 'red' }}>Interest</h5>,
                  accessor: 'interest',
                  Cell: this.renderEditable
                },
                {
                  Header: <h5 style={{ color: 'red' }}>Fees</h5>,
                  accessor: 'fees',
                  Cell: this.renderEditable
                },
                {
                  Header: <h5 style={{ color: 'red' }}>Insurance</h5>,
                  accessor: 'insurance',
                  Cell: this.renderEditable
                },
                {
                  Header: <h5 style={{ color: 'red' }}>Taxes</h5>,
                  accessor: 'taxes',
                  Cell: this.renderEditable
                },
                {
                  Header: <h5 style={{ color: 'red' }}>Security Deposit</h5>,
                  accessor: 'security_deposit',
                  Cell: this.renderEditable
                },
                {
                  Header: (
                    <h5 style={{ color: 'red' }}>Security Interest Paid</h5>
                  ),
                  accessor: 'security_interest_paid',
                  Cell: this.renderEditable
                },
                {
                  Header: <h5 style={{ color: 'red' }}>Deposit Withdrawal</h5>,
                  accessor: 'deposit_withdrawal',
                  Cell: this.renderEditable
                },
                {
                  Header: <h5 style={{ color: 'red' }}>Deposit Balance</h5>,
                  accessor: 'deposit_balance',
                  Cell: this.renderEditable
                },
                {
                  Header: <h5 style={{ color: 'red' }}>Total Cashflow</h5>,
                  accessor: 'total_cashflow',
                  Cell: this.renderEditable
                }
              ]}
            />
          </Col>
        </Row>

        <Row className="vertical-margin-item">
          <Col sm={6} md={6}>
            <Button className="button-fancy" name="Edit Inputs" url={'form1'} />
          </Col>
          <Col sm={6} md={6} className="bs-button-right">
            <Button
              className="button-fancy"
              name="Submit"
              url=""
              onClickHandler={() => {
                this.saveData()
              }}
            />
          </Col>
        </Row>
      </Grid>
    )
  }
}

export default APRRateDisplay
