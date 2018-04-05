import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Grid, Jumbotron, PageHeader, Form, Bootstrap } from 'react-bootstrap'
import { Typeahead } from 'react-bootstrap-typeahead'
import './../styles/app.css'
import TextField from './TextField'
import LiveSearch from './LiveSearch'
import Button from './Button'
import axios from 'axios'

class FormZero extends Component {
  constructor(props) {
    super(props)
    const { formDataReducer } = this.props
    console.log(formDataReducer)
    this.state = {
      partner_names: [],
      loan_themes: [],
      selectedPartnerName: formDataReducer.mfi,
      selectedLoanTheme: formDataReducer.loanType,
      selectedLoanProduct: formDataReducer.productType,
      // disableButton: '',
      errorMessage: ''
    }
  }

  componentDidMount() {
    axios.get('http://127.0.0.1:3453/partnerThemeLists').then(response => {
      this.setState({ partner_names: response.data.result.partners })
      this.setState({ loan_themes: response.data.result.themes })
    })
  }

  handleTextChange = (name, value) => {
    const { changedFormData } = this.props
    console.log(name, value)
    changedFormData([name], [value])
    // this.setState({ [name]: value })
  }

  // textFieldChangeHandler = (stateId, value) => {
  //   console.log(stateId, value)
  //   // this.setState({ [stateId]: value })
  // }

  inputsEntered() {
    const { formDataReducer } = this.props
    console.log(
      formDataReducer.mfi,
      formDataReducer.loanType,
      formDataReducer.productType,
      formDataReducer.versionNum
    )
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
    const { formDataReducer, contNewLoan, changedFormData } = this.props
    console.log(formDataReducer)
    return (
      <Grid>
        <Form>
          <Typeahead
            ref="mfi"
            label="mfi"
            options={this.state.partner_names}
            placeholder="Select MFI Partner"
            typeVal="String"
            limit={100}
            selected={formDataReducer.mfi}
            onChange={e => {
              // this.handleTextChange('selectedPartnerName', e)
              changedFormData('mfi', e)
            }}
          />
          <br />
          <Typeahead
            ref="loan"
            label="loan"
            options={this.state.loan_themes}
            placeholder="Select Loan Type"
            selected={formDataReducer.loanType}
            onChange={e => {
              changedFormData('loanType', e)
            }}
          />
          <br />
          <TextField
            ref="selectedLoanProduct"
            reduxId="productType"
            id="Loan Product"
            text="product"
            hint="i.e. small loan"
            typeVal="String"
            limit={100}
            textBody={formDataReducer.productType}
            onTextInputChange={this.handleTextChange}
          />
          <Button
            disable={this.inputsEntered()}
            name="Continue"
            url="form1"
            onClickHandler={() => {
              console.log(!this.inputsEntered())
              // console.log(e)
              // contNewLoan(
              //   this.state.selectedPartnerName,
              //   this.state.selectedLoanTheme,
              //   this.state.selectedLoanProduct
              // )
            }}
          />
          {/* </div> */}
        </Form>
      </Grid>
    )
  }
}
export default FormZero
