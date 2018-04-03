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
    const { loanSearchReducer } = this.props
    console.log(loanSearchReducer)
    this.state = {
      partner_names: [],
      loan_themes: [],
      versions: ['1', '2', '3'],
      selectedPartnerName: loanSearchReducer.mfi,
      selectedLoanTheme: loanSearchReducer.loanType,
      selectedLoanProduct: loanSearchReducer.productType,
      selectedVersionNum: loanSearchReducer.versionNum,
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

  inputsEntered() {
    console.log(this.state)
    return (
      !this.isNullOrEmpty(this.state.selectedPartnerName) &&
      !this.isNullOrEmpty(this.state.selectedLoanTheme) &&
      !this.isNullOrEmpty(this.state.selectedLoanProduct) &&
      !this.isNullOrEmpty(this.state.selectedVersionNum)
    )
  }

  isNullOrEmpty(input) {
    return input == null || input.length == 0
  }

  inputsMissing(e) {
    alert('missing inputs')
    e.preventDefault()
  }

  render() {
    const {
      submitFindLoan,
      loanSearchReducer,
      backClickedToIntroButMeghaDoesntApproveOfThisFunctionBecauseItsTooLong
    } = this.props

    return (
      <Grid>
        <Form>
          <Typeahead
            ref="mfi"
            label="mfi"
            hint="Select MFI Partner"
            options={this.state.partner_names}
            selected={loanSearchReducer.mfi}
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
            selected={loanSearchReducer.loanType}
            onChange={e => {
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
            selected={loanSearchReducer.productType}
            onChange={e => {
              this.handleTextChange('selectedLoanProduct', e)
            }}
          />

          <br />

          <Typeahead
            ref="version"
            label="version"
            options={this.state.versions}
            selected={loanSearchReducer.versionNum}
            hint="Search Versions:"
            onChange={e => {
              console.log(e)
              this.handleTextChange('selectedVersionNum', e)
              console.log(this.state.selectedVersionNum)
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
            disable={!this.inputsEntered()}
            name="Continue"
            url="form1"
            onClickHandler={e => {
              console.log(!this.inputsEntered())
              console.log(e)
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
