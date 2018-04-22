import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { Grid, Jumbotron, PageHeader, Form, Bootstrap } from 'react-bootstrap'
import './../styles/app.css'
import TextField from './TextField'
import LiveSearch from './LiveSearch'
import Button from './Button'
import axios from 'axios'
import { Typeahead } from 'react-bootstrap-typeahead'
import { Api } from './../utils'
import PropTypes from 'prop-types'

class FindLoan extends Component {
  constructor(props) {
    super(props)
    const { formDataReducer } = this.props

    this.state = {
      partner_names: [],
      loan_themes: [],
      product_types: [],
      versions: [],
      error: false
    }
  }

  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  componentDidMount() {
    const { changedFormData } = this.props
    changedFormData('back', 'findloan')
    axios
      .get('http://127.0.0.1:3453/partnerThemeLists')
      .then(response => {
        this.setState({ partner_names: response.data.result.partners })
        this.setState({ loan_themes: response.data.result.themes })
      })
      .catch(function(error) {
        console.log(error)
      })
  }

  getProductType() {
    const { formDataReducer } = this.props

    if (formDataReducer.mfi && formDataReducer.loanType) {
      let validPartnerName =
        this.state.partner_names.indexOf(formDataReducer.mfi[0]) != -1
      let validLoanTheme =
        this.state.loan_themes.indexOf(formDataReducer.loanType[0]) != -1
      console.log(formDataReducer.mfi[0], formDataReducer.loanType[0])
      if (validPartnerName && validLoanTheme) {
        axios
          .get(
            'http://127.0.0.1:3453/getPTEntry?partner_name=' +
              formDataReducer.mfi[0] +
              '&loan_theme=' +
              formDataReducer.loanType[0]
          )
          .then(response => {
            this.setState({ product_types: response.data.result.product_types })
          })
          .catch(function(error) {
            console.log(error)
          })
      }
    }
  }

  getVersionNum() {
    const { formDataReducer } = this.props
    if (
      formDataReducer.mfi &&
      formDataReducer.loanType &&
      formDataReducer.productType
    ) {
      let validPartnerName =
        this.state.partner_names.indexOf(formDataReducer.mfi[0]) != -1
      let validLoanTheme =
        this.state.loan_themes.indexOf(formDataReducer.loanType[0]) != -1
      let validProductType =
        this.state.product_types.indexOf(formDataReducer.productType[0]) != -1

      if (validPartnerName && validLoanTheme && validProductType) {
        axios
          .get(
            'http://127.0.0.1:3453/getVersionNumEntry?partner_name=' +
              formDataReducer.mfi[0] +
              '&loan_theme=' +
              formDataReducer.loanType[0] +
              '&product_type=' +
              formDataReducer.productType[0]
          )
          .then(response => {
            this.setState({
              versions: response.data.result.version_nums.map(String)
            })
          })
          .catch(function(error) {
            console.log(error)
          })
      }
    }
  }

  editLoan() {
    // search a loan
    // onsave put
  }

  duplicateLoan() {
    // need to search a loan
    // call versionnumber endpoint
    // onsave post
  }

  inputsEntered() {
    const { formDataReducer } = this.props
    if (
      !this.isNullOrEmpty(formDataReducer.mfi) &&
      !this.isNullOrEmpty(formDataReducer.loanType) &&
      !this.isNullOrEmpty(formDataReducer.productType) &&
      !this.isNullOrEmpty(formDataReducer.versionNum)
    ) {
      let x = Api.searchLoan(
        formDataReducer.mfi[0],
        formDataReducer.loanType[0],
        formDataReducer.productType[0],
        formDataReducer.versionNum[0]
      )
      console.log('WOO', x !== false)
    }
    return (
      !this.isNullOrEmpty(formDataReducer.mfi) &&
      !this.isNullOrEmpty(formDataReducer.loanType) &&
      !this.isNullOrEmpty(formDataReducer.productType) &&
      !this.isNullOrEmpty(formDataReducer.versionNum) &&
      Api.searchLoan(
        formDataReducer.mfi[0],
        formDataReducer.loanType[0],
        formDataReducer.productType[0],
        formDataReducer.versionNum[0]
      ) !== false
    )
  }

  isNullOrEmpty(input) {
    return input === null || input.length === 0
  }

  render() {
    const { formDataReducer, changedFormData, searchLoan } = this.props

    return (
      <Grid>
        <Form>
          <Typeahead
            label="mfi"
            placeholder="Select MFI Partner"
            options={this.state.partner_names}
            selected={formDataReducer.mfi}
            onInputChange={e => {
              changedFormData('mfi', [e])
              this.getProductType()
            }}
          />

          <br />
          <Typeahead
            ref="loan"
            label="loan"
            options={this.state.loan_themes}
            placeholder="Select Loan Type"
            selected={formDataReducer.loanType}
            onInputChange={e => {
              changedFormData('loanType', [e])
              this.getProductType()
            }}
          />
          <br />
          <Typeahead
            ref="product"
            label="product"
            options={this.state.product_types}
            placeholder="Search Products i.e. small loan"
            typeVal="String"
            limit={100}
            selected={formDataReducer.productType}
            onInputChange={e => {
              changedFormData('productType', [e])
              this.getVersionNum()
            }}
          />

          <br />

          <Typeahead
            ref="version"
            label="version"
            options={this.state.versions}
            selected={formDataReducer.versionNum}
            placeholder="Search Versions:"
            onInputChange={e => {
              changedFormData('versionNum', [e])
            }}
          />
          <br />

          <Button name="Back" url="" />
          <Button
            name="Edit"
            disable={!this.inputsEntered()}
            url="output"
            onClickHandler={() => {
              changedFormData('back', 'findloan')
              Api.searchLoan(
                formDataReducer.mfi[0],
                formDataReducer.loanType[0],
                formDataReducer.productType[0],
                formDataReducer.versionNum[0]
              ).then(value => {
                searchLoan(value)
              })
            }}
          />
          <Button
            name="Duplicate"
            disable={!this.inputsEntered()}
            url="form1"
            onClickHandler={() => {
              changedFormData('back', 'findloan')
              Api.searchLoan(
                formDataReducer.mfi[0],
                formDataReducer.loanType[0],
                formDataReducer.productType[0],
                formDataReducer.versionNum[0]
              ).then(value => {
                searchLoan(value)
              })
            }}
          />
        </Form>
      </Grid>
    )
  }
}

export default withRouter(FindLoan)
