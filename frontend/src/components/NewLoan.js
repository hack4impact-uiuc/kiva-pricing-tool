import React, { Component } from 'react'
import { Grid, PageHeader, Form, Row, Col } from 'react-bootstrap'
import { Typeahead } from 'react-bootstrap-typeahead'
import './../styles/app.css'
import './../styles/button.css'
import TextField from './TextField'
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
      !this.isNullOrEmpty(formDataReducer.productType)
    )
  }

  isNullOrEmpty(input) {
    return !input || !input.length
  }

  render() {
    const { formDataReducer, changedFormData, resetFormData } = this.props
    return (
      <div className="page-body-grey">
        <Grid
          fluid
          className="screen-horizontal-centered screen-vertical-centered-grid padded-element-shrink round-corners-large solid-background"
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
                typeVal="String"
                limit={100}
                selected={formDataReducer.mfi}
                onChange={e => {
                  changedFormData('mfi', e)
                }}
              />

              <Typeahead
                className="vertical-margin-item"
                label="loan"
                options={this.state.loan_themes}
                placeholder="Select Loan Type"
                selected={formDataReducer.loanType}
                onChange={e => {
                  changedFormData('loanType', e)
                }}
              />

              <TextField
                className="vertical-margin-item"
                reduxId="productType"
                id="Loan Product"
                text="product"
                hint="i.e. small loan"
                typeVal="String"
                limit={100}
                textBody={formDataReducer.productType}
                onTextInputChange={this.handleTextChange}
              />
            </Form>

            <Row>
              <Col xs={6} sm={6} md={6}>
                <Button
                  name="Back"
                  url=""
                  onClickHandler={() => resetFormData()}
                />
              </Col>
              <Col xs={6} sm={6} md={6} className="bs-button-right">
                <Button
                  className="button-default"
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
              </Col>
            </Row>
          </Row>
        </Grid>
      </div>
    )
  }
}
export default NewLoan
