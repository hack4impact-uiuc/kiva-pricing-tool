import React, { Component } from 'react'
import { Grid, PageHeader } from 'react-bootstrap'
import { Button, KivaChart } from './'
import './../styles/app.css'
import axios from 'axios'
import ReactTable from 'react-table'
import 'react-table/react-table.css'

class APRRateDisplay extends Component {
  constructor(props) {
    super(props)

    this.state = {
      // data: this.convertMatrix(),
      id: null,
      partner_names: [],
      visualtype: 'bar',
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
    const { formDataReducer, changedFormData } = this.props
    if (
      formDataReducer.calc_repayment_schedule[cellInfo.index][
        cellInfo.column.id
      ].toString() !== e.target.innerHTML
    ) {
      if (e.target.innerHTML === '') {
        formDataReducer.user_repayment_schedule[cellInfo.index][
          cellInfo.column.id
        ] = null
      } else {
        formDataReducer.user_repayment_schedule[cellInfo.index][
          cellInfo.column.id
        ] =
          e.target.innerHTML
      }
      let inputs = {
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
      for (let i = 0; i < formDataReducer.user_repayment_schedule.length; i++) {
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
      // user_change[0][0] = '0'
      let data = {
        input_form: inputs,
        user_change: user_change
      }
      axios.post('http://127.0.0.1:3453/recalculate', data).then(response => {
        const apr = response.data.result.apr
        const recal_matrix = response.data.result.recal_matrix
        changedFormData('nominalApr', apr)
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
        }
        calc_matrix[0]['period_num'] = 'Disbursement Info'
        changedFormData('calc_repayment_schedule', calc_matrix)
      })
    }
  }
  renderEditable(cellInfo) {
    const { formDataReducer } = this.props
    let editable =
      cellInfo.column.id !== 'period_num' &&
      cellInfo.column.id !== 'amount_due' &&
      cellInfo.column.id !== 'balance' &&
      cellInfo.column.id !== 'deposit_withdrawal' &&
      cellInfo.column.id !== 'security_interest_paid' &&
      cellInfo.column.id !== 'deposit_balance' &&
      cellInfo.column.id !== 'total_cashflow'
    return (
      <div
        style={
          !editable
            ? { backgroundColor: '#eaeaea' }
            : formDataReducer.user_repayment_schedule[cellInfo.index][
                cellInfo.column.id
              ] !== null
              ? { backgroundColor: '#bafaba' }
              : { backgroundColor: '#fafafa' }
        }
        contentEditable={editable}
        suppressContentEditableWarning
        onBlur={e => {
          this.updateTable(e, cellInfo)
        }}
        dangerouslySetInnerHTML={{
          __html:
            formDataReducer.calc_repayment_schedule[cellInfo.index][
              cellInfo.column.id
            ]
        }}
      />
    )
  }
  getCSV() {
    const { formDataReducer } = this.props
    let csv = [
      [
        'Period Number,Date,Days,Principal Disbursed,Principal Paid,Balance,Interest Paid,Fees Paid,Insurance Paid,Taxes Paid,Security Deposit,Interest Paid on Security,Deposit Withdrawal,Deposit Balance,Total Cashflow\n'
      ]
    ]
    let i
    let j
    let row = ''
    for (j = 0; j < 13; j++) {
      for (i = 0; i < 15; i++) {
        row += formDataReducer.original_repayment_schedule[i][j] + ','
      }
      row += '\n'
      csv.push(row)
      row = ''
    }
    let blob = new Blob(csv, { type: 'text/csv;charset=utf-8;' })
    let url = URL.createObjectURL(blob)
    let pom = document.createElement('a')
    pom.href = url
    pom.setAttribute('download', 'output.csv')
    pom.click()
  }
  createChart(paramVisual) {
    this.setState({ visualType: paramVisual })
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
    for (let i = 0; i < formDataReducer.user_repayment_schedule.length; i++) {
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
      inputs: data,
      origin_matrix: orig_matrix,
      user_change_matrix: user_change,
      repay_matrix: calc_matrix
    }
    axios
      .post('http://127.0.0.1:3453/saveNewLoan', payload)
      .then(response => {
        console.log(response)
      })
      .catch(function(error) {
        console.log(error.message + ' there was an error with the request')
      })
  }

  render() {
    const { formDataReducer } = this.props
    return (
      <Grid>
        <PageHeader> APR Rate: {formDataReducer.nominalApr}%</PageHeader>
        <Button
          name="Submit"
          url="output"
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
        <div class="col-lg-4 pull-right">
          <ul class="nav nav-pills nav-stacked">
            <button onClick={() => this.createChart('bar')}>Bar Chart</button>
            <button onClick={() => this.createChart('pie')}>Pie Chart</button>
            <button onClick={() => this.createChart('line')}>Line Chart</button>
            <button onClick={() => this.createChart('tree')}>TreeMap</button>
            <li role="presentation" class="active">
              <a href="#">Line Chart</a>
            </li>
            <li role="presentation">
              <a href="#">Pie Chart</a>
            </li>
          </ul>
        </div>
        <KivaChart visualType={this.state.visualType} />
        <br />
        <Button name="Cancel" url="" />
        <Button name="Back" url={formDataReducer.back} />
        <ReactTable
          data={formDataReducer.calc_repayment_schedule}
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
              Header: 'Deposit Withdrawal',
              accessor: 'deposit_withdrawal',
              Cell: this.renderEditable
            },
            {
              Header: 'Deposit Balance',
              accessor: 'deposit_balance',
              Cell: this.renderEditable
            },
            {
              Header: 'Total Cashflow',
              accessor: 'total_cashflow',
              Cell: this.renderEditable
            }
          ]}
        />
      </Grid>
    )
  }
}

export default APRRateDisplay
