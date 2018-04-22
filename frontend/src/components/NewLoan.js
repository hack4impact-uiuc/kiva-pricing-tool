import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Grid, Jumbotron, PageHeader, Form, Bootstrap } from 'react-bootstrap'
import { Typeahead } from 'react-bootstrap-typeahead'
import './../styles/app.css'
import TextField from './TextField'
import LiveSearch from './LiveSearch'
import Button from './Button'
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
    const { resetFormData } = this.props
    axios.get('http://127.0.0.1:3453/partnerThemeLists').then(response => {
      this.setState({ partner_names: response.data.result.partners })
      this.setState({ loan_themes: response.data.result.themes })
    })
  }

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
    const { formDataReducer, changedFormData } = this.props
    return (
      <Grid>
        <Form>
          <Typeahead
            label="mfi"
            options={this.state.partner_names}
            placeholder="Select MFI Partner"
            typeVal="String"
            limit={100}
            selected={formDataReducer.mfi}
            onChange={e => {
              changedFormData('mfi', e)
            }}
          />
          <br />
          <Typeahead
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
            reduxId="productType"
            id="Loan Product"
            text="product"
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
              axios
                .get(
                  'http://127.0.0.1:3453/getVersionNum?partner_name=' +
                    formDataReducer.mfi +
                    '&theme=' +
                    formDataReducer.loanType +
                    '&product=' +
                    formDataReducer.loanProduct
                )
                .then(response => {
                  changedFormData('versionNum', [
                    response.data.result['version'].toString()
                  ])
                })

              changedFormData('back', 'newloan')
            }}
          />
        </Form>
      </Grid>
    )
  }
}
export default NewLoan
