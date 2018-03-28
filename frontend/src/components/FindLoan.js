import React, { Component } from 'react'
import { connect } from 'react-redux'
// import { submitFindLoan, backFindLoan } from '../actions'
import { Grid, Jumbotron, PageHeader, Form, Bootstrap } from 'react-bootstrap'
import './../styles/app.css'
import TextField from './TextField'
import LiveSearch from './LiveSearch'
import Button from './Button'
import axios from 'axios'

class FindLoan extends Component {
  constructor(props) {
    super(props)
    this.state = {
      partner_names: [],
      loan_themes: [],
      versions: [],
      selectedPartnerName: '',
      selectedLoanTheme: '',
      selectedLoanProduct: '',
      selectedVersionNum: '',
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

  render() {
    return (
      <Grid>
        <Form>
          <LiveSearch
            ref="mfi"
            label="mfi"
            list={this.state.partner_names}
            hint="Select MFI Partner"
          />
          <br />
          <LiveSearch
            ref="loan"
            label="loan"
            list={this.state.loan_themes}
            hint="Select Loan Type"
          />
          <br />

          <LiveSearch
            ref="product"
            label="product"
            // id="Loan Product"
            // text="product"
            list={[]}
            hint="Search Products i.e. small loan"
            typeVal="String"
            limit={100}
          />
          <br />

          <LiveSearch
            ref="version"
            label="version"
            list={this.state.versions}
            hint="Search Versions:"
          />
          <br />

          <Button
            name="Back"
            url=""
            onClickHandler={e => {
              this.handleClick
            }}
          />
          <Button
            disable={this.state.disableButton}
            name="Continue"
            url="form1"
            onClickHandler={e => {
              this.handleClick
            }}
            formProps={
              (this.state.selectedPartnerName,
              this.state.selectedLoanTheme,
              this.state.selectedLoanProduct,
              this.state.selectedVersionNum)
            }
          />
          {/* </div> */}
        </Form>
      </Grid>
    )
  }
}

export default FindLoan
