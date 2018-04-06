import React, { Component } from 'react'
import { connect } from 'react-redux'
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
    console.log(formDataReducer)
    this.state = {
      partner_names: [],
      loan_themes: [],
      versions: ['1', '2', '3'],
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
            placeholder="Select MFI Partner"
            options={this.state.partner_names}
            selected={formDataReducer.mfi}
            onChange={e => {
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
          <Typeahead
            ref="product"
            label="product"
            options={['Apple', 'Banana', 'Orange']}
            placeholder="Search Products i.e. small loan"
            typeVal="String"
            limit={100}
            selected={formDataReducer.productType}
            onChange={e => {
              changedFormData('productType', e)
            }}
          />

          <br />

          <Typeahead
            ref="version"
            label="version"
            options={this.state.versions}
            selected={formDataReducer.versionNum}
            placeholder="Search Versions:"
            onChange={e => {
              changedFormData('versionNum', e)
            }}
          />
          <br />

          <Button name="Back" url="" />
          <Button disable={!this.inputsEntered()} name="Continue" url="form1" />
        </Form>
      </Grid>
    )
  }
}

export default FindLoan
