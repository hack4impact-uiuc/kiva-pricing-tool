import React, { Component } from 'react'
import { Grid, Jumbotron, PageHeader, Form, Bootstrap } from 'react-bootstrap'
import './../styles/app.css'
import TextField from './TextField'
import LiveSearch from './LiveSearch'
import Button from './Button'
import axios from 'axios'

class FormZero extends Component {
  constructor(props) {
    super(props)
    this.state = {
      partner_names: [],
      loan_themes: [],
      selectedPartnerName: '',
      selectedLoanTheme: '',
      selectedLoanProduct: '',
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
          {/* <div class = "col-lg-11"> */}
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
          <TextField
            ref="product"
            id="Loan Product"
            text="product"
            hint="i.e. small loan"
            typeVal="String"
            limit={100}
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
              this.state.selectedLoanProduct)
            }
          />
          {/* </div> */}
        </Form>
      </Grid>
    )
  }
}
export default FormZero
