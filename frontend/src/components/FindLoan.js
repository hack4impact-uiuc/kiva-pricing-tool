import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { Grid, PageHeader, Form, Row, Col } from 'react-bootstrap'
import './../styles/app.css'
import Button from './Button'
import axios from 'axios'
import { Typeahead } from 'react-bootstrap-typeahead'
import PropTypes from 'prop-types'

class FindLoan extends Component {
  constructor(props) {
    super(props)
    this.state = {
      partner_names: [],
      loan_themes: [],
      versions: ['1', '2', '3'],
      disableButton: '',
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
      !this.isNullOrEmpty(formDataReducer.productType) &&
      !this.isNullOrEmpty(formDataReducer.versionNum)
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
                Find Loan
              </PageHeader>
            </Col>
          </Row>
          <Row>
            <Col sm={12} md={12}>
              <Form>
                <Typeahead
                  className="vertical-margin-item"
                  label="mfi"
                  placeholder="Select MFI Partner"
                  options={this.state.partner_names}
                  selected={formDataReducer.mfi}
                  onChange={e => {
                    changedFormData('mfi', e)
                    changedFormData('backRoute', 'findloan')
                  }}
                />

                <Typeahead
                  className="vertical-margin-item"
                  ref="loan"
                  label="loan"
                  options={this.state.loan_themes}
                  placeholder="Select Loan Type"
                  selected={formDataReducer.loanType}
                  onChange={e => {
                    changedFormData('loanType', e)
                  }}
                />

                <Typeahead
                  className="vertical-margin-item"
                  ref="product"
                  label="product"
                  options={['Small Business', 'Entrepreneur', 'Education']}
                  placeholder="Search Products i.e. small loan"
                  typeVal="String"
                  limit={100}
                  selected={formDataReducer.productType}
                  onChange={e => {
                    changedFormData('productType', e)
                  }}
                />

                <Typeahead
                  className="vertical-margin-item"
                  ref="version"
                  label="version"
                  options={this.state.versions}
                  selected={formDataReducer.versionNum}
                  placeholder="Search Versions:"
                  onChange={e => {
                    changedFormData('versionNum', e)
                  }}
                />
              </Form>
            </Col>
          </Row>

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
                disable={!this.inputsEntered()}
                name="Continue"
                url="form1"
                onClickHandler={() => changedFormData('back', 'findloan')}
              />
            </Col>
          </Row>
        </Grid>
      </div>
    )
  }
}

export default withRouter(FindLoan)
