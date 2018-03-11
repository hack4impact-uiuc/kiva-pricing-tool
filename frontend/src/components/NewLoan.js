import React, { Component } from 'react'
import 'react-bootstrap-typeahead/css/Typeahead.css'
import Bootstrap, { Button } from 'react-bootstrap'
import TextField from './TextField'
import axios from 'axios'
// import 'bootstrap-select'
// import 'jquery'
import { Typeahead } from 'react-bootstrap-typeahead'

class NewLoan extends Component {
  constructor(props) {
    super(props)
    this.state = { error_message: '', multiple: false }
    var Typeahead = require('react-bootstrap-typeahead').Typeahead
  }

  componentDidMount() {
    axios.get('https://api.github.com/users/jlp-io').then(function(response) {
      console.log(response.data)
    })
    axios.get('./mfi.json').then(function(response) {
      console.log(response)
    })
  }

  render() {
    return (
      <div>
        <Typeahead
          labelKey={this.props.label}
          multiple=""
          options={this.props.list}
          placeholder={this.props.hint}
        />
        <br />
      </div>
    )
  }
}
export default NewLoan
