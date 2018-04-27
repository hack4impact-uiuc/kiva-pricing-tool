import React, { Component } from 'react'
import { Grid, PageHeader, Form, Row, Col } from 'react-bootstrap'
import { Typeahead } from 'react-bootstrap-typeahead'
import { Api } from './../utils'
import './../styles/app.css'
import { TextField, Button } from './'
import './../styles/button.css'
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
    resetFormData()
    changedFormData('back', 'newloan')
    changedFormData('error', false)
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
      !formDataReducer.error // no error
    )
  }

  isNullOrEmpty(input) {
    return !input || !input.length
  }

  render() {
    const { formDataReducer, changedFormData } = this.props
    console.log(this.inputsEntered(), 'error', formDataReducer)
    return (
      <div className="page-body-grey">
        <Grid
          fluid
          className="query-form-center padded-element-shrink round-corners-large solid-background"
        >
          <Row>
            <Col sm={12} md={12} className="bs-center">
              <PageHeader className="page-header-montserrat">
                New Loan
              </PageHeader>
            </Col>
          </Row>
          <Row>
            <Form>
              <Typeahead
                className="vertical-margin-item"
                label="mfi"
                options={this.state.partner_names}
                placeholder="Select MFI Partner"
                limit={100}
                selected={[formDataReducer.mfi]}
                onInputChange={e => {
                  changedFormData('mfi', e)
                }}
              />

              <Typeahead
                className="vertical-margin-item"
                label="loan"
                options={this.state.loan_themes}
                placeholder="Select Loan Type"
                selected={[formDataReducer.loanType]}
                onInputChange={e => {
                  changedFormData('loanType', e)
                }}
              />

              <TextField
                className="vertical-margin-item"
                reduxId="productType"
                hint="Loan Product (i.e. small loan)"
                typeVal="String"
                limit={100}
                onInputChange={e => {
                  changedFormData('productType', e)
                }}
                textBody={formDataReducer.productType}
              />
            </Form>

            <Row>
              <Col xs={6} sm={6} md={6}>
                <Button className="button-fancy" name="Back" url="" />
              </Col>
              <Col xs={6} sm={6} md={6} className="bs-button-right">
                <Button
                  className="button-fancy"
                  disable={!this.inputsEntered()}
                  name="Continue"
                  url="form1"
                  onClickHandler={() => {
                    Api.getVersionNum(
                      formDataReducer.mfi,
                      formDataReducer.loanType,
                      formDataReducer.productType
                    ).then(response => {
                      changedFormData(
                        'versionNum',
                        response['version'].toString()
                      )
                    })
                  }}
                />
              </Col>
            </Row>
          </Row>
        </Grid>
      </div>
    )
  }
}
export default NewLoan
