import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import {
  Grid,
  Jumbotron,
  PageHeader,
  Form,
  Bootstrap,
  Row,
  Col
} from 'react-bootstrap'
import './../styles/app.css'
import TextField from './TextField'
import LiveSearch from './LiveSearch'
import Button from './Button'
import axios from 'axios'
import { Typeahead } from 'react-bootstrap-typeahead'
import PropTypes from 'prop-types'

class FindLoan extends Component {
  constructor(props) {
    super(props)
    const { formDataReducer } = this.props
    // console.log(formDataReducer)
    this.state = {
      partner_names: [],
      loan_themes: [],
      product_types: [],
      versions: [],
      disableButton: '',
      errorMessage: ''
    }
  }

  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  getTables() {
    const { formDataReducer, changedFormData } = this.props
    let data = {
      params: {
        partner_name: formDataReducer.mfi[0],
        loan_theme: formDataReducer.loanType[0],
        product_type: formDataReducer.productType[0],
        version_num: formDataReducer.versionNum[0]
      }
    }

    axios
      .get('http://127.0.0.1:3453/findLoan', data)
      .then(response => {
        const apr = response.data.result.nominal_apr
        const orig_matrix = response.data.result.original_matrix
        const user_matrix = response.data.result.user_matrix
        const calc_matrix = response.data.result.calc_matrix
        changedFormData('aprRate', apr)
        changedFormData(
          'installmentTimePeriod',
          response.data.result.installment_time_period
        )
        changedFormData('repaymentType', response.data.result.repayment_type)
        changedFormData(
          'interestTimePeriod',
          response.data.result.interest_time_period
        )
        changedFormData(
          'interestPaymentType',
          response.data.result.interest_payment_type
        )
        changedFormData(
          'interestCalculationType',
          response.data.result.interest_calculation_type
        )
        changedFormData('loanAmount', response.data.result.loan_amount)
        changedFormData('installment', response.data.result.installment)
        changedFormData(
          'nominalInterestRate',
          response.data.result.nominal_interest_rate
        )
        changedFormData(
          'gracePeriodPrincipal',
          response.data.result.grace_period_principal
        )
        changedFormData(
          'gracePeriodInterestPay',
          response.data.result.grace_period_interest_pay
        )
        changedFormData(
          'gracePeriodInterestCalculate',
          response.data.result.grace_period_interest_calculate
        )
        changedFormData(
          'gracePeriodBalloon',
          response.data.result.grace_period_balloon
        )
        changedFormData(
          'feePercentUpfront',
          response.data.result.fee_percent_upfront
        )
        changedFormData(
          'feePercentOngoing',
          response.data.result.fee_percent_ongoing
        )
        changedFormData(
          'feeFixedUpfront',
          response.data.result.fee_fixed_upfront
        )
        changedFormData(
          'feeFixedOngoing',
          response.data.result.fee_fixed_ongoing
        )
        changedFormData('taxPercentFees', response.data.result.tax_percent_fees)
        changedFormData(
          'taxPercentInterest',
          response.data.result.tax_percent_interest
        )
        changedFormData(
          'insurancePercentUpfront',
          response.data.result.insurance_fixed_upfront
        )
        changedFormData(
          'insurancePercentOngoing',
          response.data.result.insurance_fixed_ongoing
        )
        changedFormData(
          'insuranceFixedUpfront',
          response.data.result.insurance_fixed_upfront
        )
        changedFormData(
          'insuranceFixedOngoing',
          response.data.result.insurance_fixed_ongoing
        )
        changedFormData(
          'securityDepositPercentUpfront',
          response.data.result.security_deposit_percent_upfront
        )
        changedFormData(
          'securityDepositPercentOngoing',
          response.data.result.security_deposit_percent_ongoing
        )
        changedFormData(
          'securityDepositFixedUpfront',
          response.data.result.security_deposit_fixed_upfront
        )
        changedFormData(
          'securityDepositFixedOngoing',
          response.data.result.security_deposit_fixed_ongoing
        )
        changedFormData(
          'interestPaidOnDepositPercent',
          response.data.result.interest_paid_on_deposit_percent
        )
        let reformatted_matrix = []
        let reformatted_user_matrix = []
        let reformatted_calc_matrix = []
        if (orig_matrix != null && user_matrix != null && calc_matrix != null) {
          for (let i = 0; i < orig_matrix[0].length; i++) {
            reformatted_matrix.push({
              period_num: orig_matrix[0][i],
              payment_due_date: orig_matrix[1][i],
              days: orig_matrix[2][i],
              amount_due: orig_matrix[3][i],
              principal_payment: orig_matrix[4][i],
              balance: orig_matrix[5][i],
              interest: orig_matrix[6][i],
              fees: orig_matrix[7][i],
              insurance: orig_matrix[8][i],
              taxes: orig_matrix[9][i],
              security_deposit: orig_matrix[10][i],
              security_interest_paid: orig_matrix[11][i],
              deposit_withdrawal: orig_matrix[12][i],
              deposit_balance: orig_matrix[13][i],
              total_cashflow: orig_matrix[14][i]
            })
            reformatted_user_matrix.push({
              period_num: user_matrix[0][i],
              payment_due_date: user_matrix[1][i],
              days: user_matrix[2][i],
              amount_due: user_matrix[3][i],
              principal_payment: user_matrix[4][i],
              balance: user_matrix[5][i],
              interest: user_matrix[6][i],
              fees: user_matrix[7][i],
              insurance: user_matrix[8][i],
              taxes: user_matrix[9][i],
              security_deposit: user_matrix[10][i],
              security_interest_paid: user_matrix[11][i],
              deposit_withdrawal: user_matrix[12][i],
              deposit_balance: user_matrix[13][i],
              total_cashflow: user_matrix[14][i]
            })
            reformatted_calc_matrix.push({
              period_num: calc_matrix[0][i],
              payment_due_date: calc_matrix[1][i],
              days: calc_matrix[2][i],
              amount_due: calc_matrix[3][i],
              principal_payment: calc_matrix[4][i],
              balance: calc_matrix[5][i],
              interest: calc_matrix[6][i],
              fees: calc_matrix[7][i],
              insurance: calc_matrix[8][i],
              taxes: calc_matrix[9][i],
              security_deposit: calc_matrix[10][i],
              security_interest_paid: calc_matrix[11][i],
              deposit_withdrawal: calc_matrix[12][i],
              deposit_balance: calc_matrix[13][i],
              total_cashflow: calc_matrix[14][i]
            })
          }
          reformatted_matrix[0]['period_num'] = 'Disbursement Info'
          calc_matrix[0]['period_num'] = 'Disbursement Info'
          changedFormData('original_repayment_schedule', reformatted_matrix)
          changedFormData('user_repayment_schedule', reformatted_user_matrix)
          changedFormData('calc_repayment_schedule', reformatted_calc_matrix)
        }
      })
      .catch(function(error) {
        console.log(
          error + ' there was an error with the request' + data.start_name
        )
      })
  }

  componentDidMount() {
    const { resetFormData } = this.props
    axios.get('http://127.0.0.1:3453/getMFIEntry').then(response => {
      this.setState({ partner_names: response.data.result.partners })
    })

    // this._unblock = this.context.router.history.block(() => {
    //   resetFormData()
    // })
  }

  // componentWillUnmount() {
  //   // When the component unmounts, call the function
  //   this._unblock()
  // }

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
      !this.isNullOrEmpty(formDataReducer.versionNum)
    )
  }

  isNullOrEmpty(input) {
    return input == null || input.length == 0
  }

  render() {
    const { formDataReducer, changedFormData, resetFormData } = this.props

    return (
      <div className="page-body-grey">
        <Grid
          fluid
          className="screen-horizontal-centered screen-vertical-centered-grid padded-element-shrink round-corners-large solid-background"
        >
          <Row>
            <Col sm={12} md={12} className="bs-center">
              <PageHeader className="page-header-montserrat">
                Find Loan
              </PageHeader>
            </Col>
          </Row>
          <Row>
            <Col sm={12} md={12}>
              <Form>
                <Typeahead
                  className="vertical-margin-item"
                  label="mfi"
                  placeholder="Select MFI Partner"
                  options={this.state.partner_names}
                  selected={formDataReducer.mfi}
                  onChange={e => {
                    changedFormData('mfi', e)
                    changedFormData('backRoute', 'findloan')
                    axios
                      .get('http://127.0.0.1:3453/getLTEntry', {
                        params: {
                          partner_name: e[0]
                        }
                      })
                      .then(response => {
                        this.setState({
                          loan_themes: response.data.result.themes
                        })
                      })
                  }}
                />

                <Typeahead
                  className="vertical-margin-item"
                  ref="loan"
                  label="loan"
                  disabled={this.isNullOrEmpty(formDataReducer.mfi)}
                  options={this.state.loan_themes}
                  placeholder="Select Loan Type"
                  selected={formDataReducer.loanType}
                  onChange={e => {
                    changedFormData('loanType', e)
                    axios
                      .get('http://127.0.0.1:3453/getPTEntry', {
                        params: {
                          partner_name: formDataReducer.mfi[0],
                          loan_theme: e[0]
                        }
                      })
                      .then(response => {
                        this.setState({
                          product_types: response.data.result.product_types
                        })
                      })
                  }}
                />

                <Typeahead
                  className="vertical-margin-item"
                  ref="product"
                  label="product"
                  disabled={
                    !(
                      !this.isNullOrEmpty(formDataReducer.mfi) &&
                      !this.isNullOrEmpty(formDataReducer.loanType)
                    )
                  }
                  options={this.state.product_types}
                  placeholder="Search Products i.e. small loan"
                  typeVal="String"
                  limit={100}
                  selected={formDataReducer.productType}
                  onChange={e => {
                    changedFormData('productType', e)
                    axios
                      .get('http://127.0.0.1:3453/getVersionNumEntry', {
                        params: {
                          partner_name: formDataReducer.mfi[0],
                          loan_theme: formDataReducer.loanType[0],
                          product_type: e[0]
                        }
                      })
                      .then(response => {
                        this.setState({
                          versions: response.data.result.version_nums
                        })
                      })
                  }}
                />

                <Typeahead
                  className="vertical-margin-item"
                  ref="version"
                  label="version"
                  disabled={
                    !(
                      !this.isNullOrEmpty(formDataReducer.mfi) &&
                      !this.isNullOrEmpty(formDataReducer.loanType) &&
                      !this.isNullOrEmpty(formDataReducer.productType)
                    )
                  }
                  options={this.state.versions}
                  selected={formDataReducer.versionNum}
                  placeholder="Search Versions:"
                  onChange={e => {
                    changedFormData('versionNum', e)
                  }}
                />
              </Form>
            </Col>
          </Row>

          <Row>
            <Col xs={6} sm={6} md={6}>
              <Button
                name="Back"
                url=""
                onClickHandler={() => resetFormData()}
              />
            </Col>
            <Col xs={6} sm={6} md={6} className="bs-button-right">
              <Button
                disable={!this.inputsEntered()}
                name="Duplicate"
                url="form1"
                onClickHandler={() => {
                  this.getTables()
                  // changedFormData('versionNum', this.state.versions.length + 1)
                }}
              />
              <Button
                disable={!this.inputsEntered()}
                name="Continue"
                url="output"
                onClickHandler={() => {
                  changedFormData('back', 'findloan')
                  this.getTables()
                }}
              />
            </Col>
          </Row>
        </Grid>
      </div>
    )
  }
}

export default withRouter(FindLoan)
