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
    this.state = {
      partner_names: ['hello', 'yo', 'swag'],
      loan_themes: ['hello', 'yo', 'swag'],
      versions: ['1', '2', '3'],
      selectedPartnerName: '',
      selectedLoanTheme: '',
      selectedLoanProduct: '',
      selectedVersionNum: '',
      disableButton: '',
      errorMessage: ''
    }
  }

  componentDidMount() {
    // axios.get('http://127.0.0.1:3453/partnerThemeLists').then(response => {
    //   this.setState({ partner_names: response.data.result.partners })
    //   this.setState({ loan_themes: response.data.result.themes })
    // })
  }

  onChangeHandler() {
    this.setState({
      selectedPartnerName: this.refs.mfi.value
    })
  }

  handleChange(i) {
    console.log(i)
    this.setState({ selectedPartnerName: i.target.value })
  }
  render() {
    const {
      submitFindLoan,
      formDataReducer,
      backClickedToIntroButMeghaDoesntApproveOfThisFunctionBecauseItsTooLong
    } = this.props
    console.log(formDataReducer)
    console.log(formDataReducer.loanType)
    console.log('hi')

    return (
      <Grid>
        <Form>
          <Typeahead
            ref="mfi"
            label="mfi"
            hint="Select MFI Partner"
            options={this.state.partner_names}
            selected={formDataReducer.mfi}
            onInputChange={e => {
              this.setState({ selectedPartnerName: e })
            }}
          />
          <br />
          <Typeahead
            ref="loan"
            label="loan"
            options={this.state.loan_themes}
            hint="Select Loan Type"
            selected={formDataReducer.loanType}
            onInputChange={e => {
              console.log(e)
              this.setState({ selectedLoanTheme: e })
            }}
          />
          <br />
          {/* <input>
            onChange={event => this.handleChange(event)}
          </input> */}
          <Typeahead
            ref="product"
            label="product"
            options={[]}
            hint="Search Products i.e. small loan"
            typeVal="String"
            limit={100}
            selected={formDataReducer.productType}
            onInputChange={e => {
              this.setState({ selectedLoanProduct: e })
            }}
          />

          <br />

          <Typeahead
            ref="version"
            label="version"
            options={this.state.versions}
            hint="Search Versions:"
            onInputChange={e => {
              this.setState({ selectedVersionNum: e })
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
              console.log(
                this.state.selectedPartnerName,
                this.state.selectedLoanTheme,
                this.state.selectedLoanProduct,
                this.state.selectedVersionNum
              )
              submitFindLoan(
                this.state.selectedPartnerName,
                this.state.selectedLoanTheme,
                this.state.selectedLoanProduct,
                this.state.selectedVersionNum
              )
            }}
          />
          {/* </div> */}
        </Form>
      </Grid>
    )
  }
}

export default FindLoan
