import React, { Component } from 'react'
import { Grid, Jumbotron, PageHeader, Form, Bootstrap } from 'react-bootstrap'
import './../styles/app.css'
import TextField from './TextField'
import LiveSearch from './LiveSearch'
import Button from './Button'
import axios from 'axios'
import { Typeahead } from 'react-bootstrap-typeahead'

class FormZero extends Component {
  constructor(props) {
    super(props)
    this.state = {
	  partner_names: [],
   	loan_themes: [],
	  selectedPartnerName: '',
    selectedLoanTheme: '',
    selectedLoanProduct: 'small loan',
    disableButton: '',
    errorMessage: '',
	  versionNum: '',
    }
  }

  componentDidMount() {
    axios.get('http://127.0.0.1:3453/partnerThemeLists').then(response => {
	  console.log(response.data.result)
      this.setState({ partner_names: response.data.result.partners })
      this.setState({ loan_themes: response.data.result.themes })
    })
  }
  
  handleMFIChange(e) {
    this.setState({ selectedPartnerName: e })
  }
  
  handleLoanChange(e) {
    this.setState({ selectedLoanTheme: e })
  }
  
  handleLoanProductChange(e) {
    this.setState({ selectedLoanProduct: e })
  }
  
  render() {
    return (
      <Grid>
        <Form>
          {/* <div class = "col-lg-11"> */}
          <Typeahead
          labelKey={this.props.label}
          multiple=""
          options={this.state.partner_names}
          placeholder="select MFI partner"
     	  onChange={this.handleMFIChange.bind(this)}
		  />
          <br />
		  <Typeahead
          labelKey={this.props.label}
          multiple=""
          options={this.state.loan_themes}
          placeholder="select loan product"
     	  onChange={this.handleLoanChange.bind(this)}
          />
          <br />
          <TextField
            ref="product"
            id="Loan Product"
            text="product"
            hint="i.e. small loan"
            typeVal="String"
            limit={100}
        	onChange={this.handleLoanProductChange.bind(this)}
          />
          <Button
            disable={this.state.disableButton}
            name="Continue"
            url="form1"
            onClickHandler={e => {
              this.handleClick
            }}
          />
	  <Button
            disable={this.state.disableButton}
            name="Back"
            url=""
            onClickHandler={e => {
              this.handleClick
            }}
	  />

	  <button
            type="button"
            disabled={this.props.disable}
	    onClick={() => {
	    axios.get('http://127.0.0.1:3453/getVersionNum?partner_name=' + this.state.selectedPartnerName + '&theme=' + this.state.selectedLoanTheme + '&product=' + this.state.selectedLoanProduct).then(response => {
		this.setState({versionNum: response.data.result})
	    }
	    )
	    }
	    }
            >Find Version</button>
	    <p>{this.state.versionNum}</p>
          {/* </div> */}
        </Form>
      </Grid>
    )
  }
}
export default FormZero
