import React, { Component } from 'react'
import { connect } from 'react-redux'
// import { submitFindLoan, backFindLoan } from '../actions'
import { Grid, Jumbotron, PageHeader, Form, Bootstrap } from 'react-bootstrap'
import './../styles/app.css'
import TextField from './TextField'
import LiveSearch from './LiveSearch'
import Button from './Button'
import axios from 'axios'
import { Typeahead } from 'react-bootstrap-typeahead'

class FindLoan extends Component {
  constructor(props) {
    super(props)
    const { formDataReducer } = this.props
    this.state = {
      partner_names: ['hello', 'yo', 'swag'],
      loan_themes: ['hello', 'yo', 'swag'],
      versions: ['1', '2', '3'],
      selectedPartnerName: formDataReducer.mfi,
      selectedLoanTheme: formDataReducer.loanType,
      selectedLoanProduct: formDataReducer.productType,
      selectedVersionNum: formDataReducer.versionNum,
      disableButton: '',
      errorMessage: ''
    }
  }

  componentDidMount() {
    axios.get('http://127.0.0.1:3453/partnerThemeLists').then(response => {
      this.setState({ partner_names: response.data.result.partners })
      this.setState({ loan_themes: response.data.result.themes })
    })
  }

  handleTextChange(name, value) {
    this.setState({ [name]: value })
  }

  render() {
    const {
      submitFindLoan,
      formDataReducer,
      backClickedToIntroButMeghaDoesntApproveOfThisFunctionBecauseItsTooLong
    } = this.props
    // console.log(this.state)
    // console.log(formDataReducer.loanType)

    return (
      <Grid>
        <Form>
          <Typeahead
            ref="mfi"
            label="mfi"
            hint="Select MFI Partner"
            options={this.state.partner_names}
            selected={formDataReducer.mfi}
            onChange={e => {
              this.handleTextChange('selectedPartnerName', e)
            }}
          />
          <br />
          <Typeahead
            ref="loan"
            label="loan"
            options={this.state.loan_themes}
            hint="Select Loan Type"
            selected={formDataReducer.loanType}
            onChange={e => {
              console.log(e)
              this.handleTextChange('selectedLoanTheme', e)
            }}
          />
          <br />
          <Typeahead
            ref="product"
            label="product"
            options={['Apple', 'Banana', 'Orange']}
            hint="Search Products i.e. small loan"
            typeVal="String"
            limit={100}
            selected={formDataReducer.productType}
            onChange={e => {
              this.handleTextChange('selectedLoanProduct', e)
            }}
          />

          <br />

          <Typeahead
            ref="version"
            label="version"
            options={this.state.versions}
            selected={formDataReducer.versionNum}
            hint="Search Versions:"
            onChange={e => {
              this.handleTextChange('selectedVersionNum', e)
            }}
          />
          <br />

          <Button
            name="Back"
            url=""
            onClickHandler={e => {
              backClickedToIntroButMeghaDoesntApproveOfThisFunctionBecauseItsTooLong()
            }}
          />
          <Button
            disable={this.state.disableButton}
            name="Continue"
            url="form1"
            onClickHandler={() => {
              submitFindLoan(
                this.state.selectedPartnerName,
                this.state.selectedLoanTheme,
                this.state.selectedLoanProduct,
                this.state.selectedVersionNum
              )
            }}
          />
        </Form>
      </Grid>
    )
  }
}

export default FindLoan
