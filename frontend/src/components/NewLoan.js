import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Grid, Jumbotron, PageHeader, Form, Bootstrap } from 'react-bootstrap'
import { Typeahead } from 'react-bootstrap-typeahead'
import { Api } from './../utils'
import './../styles/app.css'
import { TextField, Button } from './'
import axios from 'axios'
import PropTypes from 'prop-types'

class NewLoan extends Component {
  constructor(props) {
    super(props)
    const { formDataReducer } = this.props
    this.state = {
      partner_names: [],
      loan_themes: [],
      selectedPartnerName: formDataReducer.mfi,
      selectedLoanTheme: formDataReducer.loanType,
      selectedLoanProduct: formDataReducer.productType,
      errorMessage: ''
    }
  }

  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  componentDidMount() {
    const { resetFormData, changedFormData } = this.props
    changedFormData('back', 'newloan')
    axios.get('http://127.0.0.1:3453/partnerThemeLists').then(response => {
      this.setState({ partner_names: response.data.result.partners })
      this.setState({ loan_themes: response.data.result.themes })
    })
  }

  inputsEntered() {
    const { formDataReducer } = this.props
    return (
      !this.isNullOrEmpty(formDataReducer.mfi) &&
      !this.isNullOrEmpty(formDataReducer.loanType) &&
      !this.isNullOrEmpty(formDataReducer.productType)
    )
  }

  isNullOrEmpty(input) {
    return input == null || input.length == 0
  }

  render() {
    const { formDataReducer, changedFormData } = this.props
    return (
      <Grid>
        <Form>
          <Typeahead
            label="mfi"
            options={this.state.partner_names}
            placeholder="Select MFI Partner"
            limit={100}
            selected={formDataReducer.mfi}
            onInputChange={e => {
              changedFormData('mfi', e)
            }}
          />
          <br />
          <Typeahead
            label="loan"
            options={this.state.loan_themes}
            placeholder="Select Loan Type"
            selected={formDataReducer.loanType}
            onInputChange={e => {
              changedFormData('loanType', e)
            }}
          />
          <br />
          <TextField
            reduxId="productType"
            id="Loan Product"
            hint="i.e. small loan"
            typeVal="String"
            limit={100}
            textBody={formDataReducer.productType}
          />
          <Button name="Back" url="" />

          <Button
            disable={!this.inputsEntered()}
            name="Continue"
            url="form1"
            onClickHandler={() => {
              Api.getVersionNum(
                formDataReducer.mfi,
                formDataReducer.loanType,
                formDataReducer.productType
              ).then(response => {
                changedFormData('versionNum', response['version'].toString())
              })
            }}
          />
        </Form>
      </Grid>
    )
  }
}
export default NewLoan
