import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { Grid, PageHeader, Form, Row, Col } from 'react-bootstrap'
import './../styles/app.css'
import Button from './Button'
import axios from 'axios'
import { Typeahead } from 'react-bootstrap-typeahead'
import { Api } from './../utils'
import PropTypes from 'prop-types'

class FindLoan extends Component {
  constructor(props) {
    super(props)
    this.state = {
      partner_names: [],
      loan_themes: [],
      product_types: [],
      versions: [],
      disableButton: '',

      // Error class handling for typeaheads
      partnerClass: 'vertical-margin-item',
      themeClass: 'vertical-margin-item',
      productClass: 'vertical-margin-item',
      versionClass: 'vertical-margin-item',

      // Error message handling
      partnerErrorClass: 'typeahead-message-hidden',
      themeErrorClass: 'typeahead-message-hidden',
      productErrorClass: 'typeahead-message-hidden',
      versionErrorClass: 'typeahead-message-hidden'
    }
    this.getTables = this.getTables.bind(this)
  }

  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  /**
   * Gets existing loan and repayment schedule from backend to populate redux.
   */
  getTables() {
    const { formDataReducer, changedFormData } = this.props
    let data = {
      params: {
        partner_name: formDataReducer.mfi,
        loan_theme: formDataReducer.loanType,
        product_type: formDataReducer.productType,
        version_num: formDataReducer.versionNum
      }
    }

    Api.searchLoan(
      formDataReducer.mfi,
      formDataReducer.loanType,
      formDataReducer.productType,
      formDataReducer.versionNum
    )
      .then(response => {
        const apr = response.data.result.nominal_apr
        const orig_matrix = response.data.result.original_matrix
        const user_matrix = response.data.result.user_matrix
        const calc_matrix = response.data.result.calc_matrix
        changedFormData('new_repayment_schedule', calc_matrix)
        changedFormData('nominalApr', apr)
        changedFormData(
          'installmentTimePeriod',
          response.data.result.installment_time_period
        )
        changedFormData('startName', response.data.result.start_name)
        changedFormData('updateName', response.data.result.update_name)
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
        if (
          orig_matrix !== null &&
          user_matrix !== null &&
          calc_matrix !== null
        ) {
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
          reformatted_matrix.push({
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
          reformatted_user_matrix.push({
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
          reformatted_calc_matrix.push({
            period_num: 'Total',
            payment_due_date: '',
            days: 0,
            amount_due: 0,
            principal_payment: 0,
            balance: '',
            interest: 0,
            fees: 0,
            insurance: 0,
            taxes: 0,
            security_deposit: 0,
            security_interest_paid: 0,
            deposit_withdrawal: 0,
            deposit_balance: '',
            total_cashflow: 0
          })
          let last = reformatted_calc_matrix.length - 1
          for (let i = 0; i < reformatted_calc_matrix.length - 1; i++) {
            reformatted_calc_matrix[last]['days'] +=
              reformatted_calc_matrix[i]['days']
            reformatted_calc_matrix[last]['amount_due'] +=
              reformatted_calc_matrix[i]['amount_due']
            reformatted_calc_matrix[last]['principal_payment'] +=
              reformatted_calc_matrix[i]['principal_payment']
            reformatted_calc_matrix[last]['interest'] +=
              reformatted_calc_matrix[i]['interest']
            reformatted_calc_matrix[last]['fees'] +=
              reformatted_calc_matrix[i]['fees']
            reformatted_calc_matrix[last]['insurance'] +=
              reformatted_calc_matrix[i]['insurance']
            reformatted_calc_matrix[last]['taxes'] +=
              reformatted_calc_matrix[i]['taxes']
            reformatted_calc_matrix[last]['security_deposit'] +=
              reformatted_calc_matrix[i]['security_deposit']
            reformatted_calc_matrix[last]['security_interest_paid'] +=
              reformatted_calc_matrix[i]['security_interest_paid']
            reformatted_calc_matrix[last]['deposit_withdrawal'] +=
              reformatted_calc_matrix[i]['deposit_withdrawal']
            reformatted_calc_matrix[last]['total_cashflow'] +=
              reformatted_calc_matrix[i]['total_cashflow']
          }
          reformatted_calc_matrix[last][
            'principal_payment'
          ] = reformatted_calc_matrix[last]['principal_payment'].toFixed(2)
          reformatted_calc_matrix[last]['interest'] = reformatted_calc_matrix[
            last
          ]['interest'].toFixed(2)
          reformatted_calc_matrix[last]['fees'] = reformatted_calc_matrix[last][
            'fees'
          ].toFixed(2)
          reformatted_calc_matrix[last]['insurance'] = reformatted_calc_matrix[
            last
          ]['insurance'].toFixed(2)
          reformatted_calc_matrix[last]['taxes'] = reformatted_calc_matrix[
            last
          ]['taxes'].toFixed(2)
          reformatted_calc_matrix[last][
            'security_deposit'
          ] = reformatted_calc_matrix[last]['security_deposit'].toFixed(2)
          reformatted_calc_matrix[last][
            'security_interest_paid'
          ] = reformatted_calc_matrix[last]['security_interest_paid'].toFixed(2)
          reformatted_calc_matrix[last][
            'deposit_withdrawal'
          ] = reformatted_calc_matrix[last]['deposit_withdrawal'].toFixed(2)
          reformatted_calc_matrix[last][
            'total_cashflow'
          ] = reformatted_calc_matrix[last]['total_cashflow'].toFixed(2)
          reformatted_matrix[0]['period_num'] = 'Disbursement'
          reformatted_calc_matrix[0]['period_num'] = 'Disbursement'
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
    const { changedFormData } = this.props
    changedFormData('back', '')
    axios
      .get('http://127.0.0.1:3453/getMFIEntry')
      .then(response => {
        this.setState({ partner_names: response.data.result.partners })
      })
      .catch(function(error) {
        console.log(error)
      })
  }

  /**
   * Gets all product types of data with given entries.
   */
  getProductType() {
    const { formDataReducer, changedFormData } = this.props

    if (formDataReducer.mfi && formDataReducer.loanType) {
      let validPartnerName =
        this.state.partner_names.indexOf(formDataReducer.mfi) !== -1
      let validLoanTheme =
        this.state.loan_themes.indexOf(formDataReducer.loanType) !== -1

      if (validPartnerName && validLoanTheme) {
        Api.getProductType(formDataReducer.mfi, formDataReducer.loanType).then(
          response => this.setState({ product_types: response })
        )
      } else if (!validPartnerName) {
        changedFormData('loanType', '')
      }
    }
  }

  /**
   * Gets all version of loans with entered data.
   */
  getVersionNumEntries() {
    const { formDataReducer, changedFormData } = this.props
    if (
      formDataReducer.mfi &&
      formDataReducer.loanType &&
      formDataReducer.productType
    ) {
      let validPartnerName =
        this.state.partner_names.indexOf(formDataReducer.mfi) !== -1
      let validLoanTheme =
        this.state.loan_themes.indexOf(formDataReducer.loanType) !== -1
      let validProductType =
        this.state.product_types.indexOf(formDataReducer.productType) !== -1

      if (validPartnerName && validLoanTheme && validProductType) {
        Api.getVersionNumEntries(
          formDataReducer.mfi,
          formDataReducer.loanType,
          formDataReducer.productType
        ).then(response => this.setState({ versions: response }))
      } else if (!validPartnerName) {
        changedFormData('loanType', '')
      } else if (!validProductType) {
        changedFormData('productType', '')
      }
    }
  }

  inputsEntered() {
    const { formDataReducer } = this.props
    if (
      !this.isNullOrEmpty(formDataReducer.mfi) &&
      !this.isNullOrEmpty(formDataReducer.loanType) &&
      !this.isNullOrEmpty(formDataReducer.productType) &&
      !this.isNullOrEmpty(formDataReducer.versionNum)
    ) {
      let validPartnerName =
        this.state.partner_names.indexOf(formDataReducer.mfi) !== -1
      let validLoanTheme =
        this.state.loan_themes.indexOf(formDataReducer.loanType) !== -1
      let validProductType =
        this.state.product_types.indexOf(formDataReducer.productType) !== -1
      let validVersionNum =
        this.state.versions.indexOf(formDataReducer.versionNum) !== -1
      return (
        validPartnerName &&
        validLoanTheme &&
        validProductType &&
        validVersionNum
      )
    }
    return false
  }

  // Method to check if MFI partner exists in queried partner list
  // Entry is valid if DB has corresponding name
  isValidMFI(input) {
    return this.state.partner_names.indexOf(input) !== -1
  }

  // Method to check if LT exists in queried LT list
  // Entry is valid if DB has corresponding name
  isValidTheme(input) {
    return this.state.loan_themes.indexOf(input) !== -1
  }

  // Method to check if PT exists in queried PT list
  // Entry is valid if DB has corresponding name
  isValidPT(input) {
    return this.state.product_types.indexOf(input) !== -1
  }

  // Method to check if version exists in queried version list
  // Entry is valid if DB has corresponding name
  isValidVersionNum(input) {
    return this.state.versions.indexOf(input) !== -1
  }

  isNullOrEmpty(input) {
    return !input || !input.length
  }

  render() {
    const { formDataReducer, changedFormData } = this.props
    return (
      <div className="page-body-grey">
        <Grid
          fluid
          className="query-form-center padded-element-shrink round-corners-large solid-background"
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
                  className={this.state.partnerClass}
                  placeholder="Select Field Partner"
                  options={this.state.partner_names}
                  selected={formDataReducer.mfi ? [formDataReducer.mfi] : []}
                  onInputChange={e => {
                    this.getProductType()
                    axios
                      .get('http://127.0.0.1:3453/getLTEntry', {
                        params: {
                          partner_name: e
                        }
                      })
                      .then(response => {
                        this.setState({
                          loan_themes: response.data.result.themes
                        })
                        changedFormData('mfi', e)
                      })
                      .catch(function(error) {
                        changedFormData('mfi', '')
                        changedFormData('loanType', '')
                        changedFormData('productType', '')
                        changedFormData('versionNum', '')
                      })

                    // Check if entered value is valid and switch classes
                    if (!this.isValidMFI(e)) {
                      this.setState({
                        partnerClass: 'vertical-margin-item typeahead-error',
                        partnerErrorClass: 'typeahead-message-show'
                      })
                    } else if (this.isValidMFI(e)) {
                      this.setState({
                        partnerClass: 'vertical-margin-item',
                        partnerErrorClass: 'typeahead-message-hidden'
                      })
                    }
                  }}
                />
                <p className={this.state.partnerErrorClass}>
                  MFI Partner not found.
                </p>

                <Typeahead
                  className={this.state.themeClass}
                  disabled={this.isNullOrEmpty(formDataReducer.mfi)}
                  ref="loan"
                  options={this.state.loan_themes}
                  placeholder="Select Loan Theme"
                  selected={
                    formDataReducer.loanType ? [formDataReducer.loanType] : []
                  }
                  onInputChange={e => {
                    changedFormData('loanType', e)
                    changedFormData('productType', '')
                    changedFormData('versionNum', '')
                    this.getProductType()

                    // Check if entered value is valid and switch classes
                    if (!this.isValidTheme(e)) {
                      this.setState({
                        themeClass: 'vertical-margin-item typeahead-error',
                        themeErrorClass: 'typeahead-message-show'
                      })
                      changedFormData('loanType', '')
                    } else if (this.isValidTheme(e)) {
                      this.setState({
                        themeClass: 'vertical-margin-item',
                        themeErrorClass: 'typeahead-message-hidden'
                      })
                    }
                  }}
                />
                <p className={this.state.themeErrorClass}>
                  Loan Theme not found.
                </p>

                <Typeahead
                  className={this.state.productClass}
                  disabled={
                    this.isNullOrEmpty(formDataReducer.mfi) ||
                    this.isNullOrEmpty(formDataReducer.loanType)
                  }
                  ref="product"
                  options={this.state.product_types}
                  placeholder="Select Loan Product"
                  typeVal="String"
                  limit={100}
                  selected={
                    formDataReducer.productType
                      ? [formDataReducer.productType]
                      : []
                  }
                  onInputChange={e => {
                    changedFormData('productType', e)
                    changedFormData('versionNum', '')
                    this.getVersionNumEntries()

                    // Check if entered value is valid and switch classes
                    if (!this.isValidPT(e)) {
                      this.setState({
                        productClass: 'vertical-margin-item typeahead-error',
                        productErrorClass: 'typeahead-message-show'
                      })
                    } else if (this.isValidPT(e)) {
                      this.setState({
                        productClass: 'vertical-margin-item',
                        productErrorClass: 'typeahead-message-hidden'
                      })
                    }
                  }}
                />
                <p className={this.state.productErrorClass}>
                  Product type not found.
                </p>

                <Typeahead
                  className={this.state.versionClass}
                  ref="version"
                  placeholder="Select Version Number"
                  disabled={
                    this.isNullOrEmpty(formDataReducer.mfi) ||
                    this.isNullOrEmpty(formDataReducer.loanType) ||
                    this.isNullOrEmpty(formDataReducer.productType)
                  }
                  options={this.state.versions}
                  selected={
                    formDataReducer.versionNum
                      ? [formDataReducer.versionNum]
                      : []
                  }
                  onInputChange={e => {
                    changedFormData('versionNum', e)

                    // Check if entered value is valid and switch classes
                    if (!this.isValidVersionNum(e)) {
                      this.setState({
                        versionClass: 'vertical-margin-item typeahead-error',
                        versionErrorClass: 'typeahead-message-show'
                      })
                    } else if (this.isValidVersionNum(e)) {
                      this.setState({
                        versionClass: 'vertical-margin-item',
                        versionErrorClass: 'typeahead-message-hidden'
                      })
                    }
                  }}
                />
                <p className={this.state.versionErrorClass}>
                  Version number not found.
                </p>
              </Form>
            </Col>
          </Row>

          <Row>
            <Col xs={6} sm={6} md={6}>
              <Button
                className="button-fancy"
                name="Edit"
                disable={!this.inputsEntered()}
                url="output"
                onClickHandler={() => {
                  this.getTables()
                }}
              />
            </Col>
            <Col xs={6} sm={6} md={6} className="bs-button-right">
              <Button
                className="button-fancy"
                name="Duplicate"
                disable={!this.inputsEntered()}
                url="form1"
                onClickHandler={() => {
                  Api.getVersionNum(
                    formDataReducer.mfi,
                    formDataReducer.loanType,
                    formDataReducer.productType
                  ).then(response => {
                    changedFormData('versionNum', response.version)
                  })
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
