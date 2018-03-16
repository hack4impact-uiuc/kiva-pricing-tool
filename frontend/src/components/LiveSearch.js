import React, { Component } from 'react'
import 'react-bootstrap-typeahead/css/Typeahead.css'
import Bootstrap, { Button } from 'react-bootstrap'
import TextField from './TextField'
import axios from 'axios'
import { Typeahead } from 'react-bootstrap-typeahead'

class LiveSearch extends Component {
  constructor(props) {
    super(props)
    this.state = { error_message: '', multiple: false, value: '' }
    var Typeahead = require('react-bootstrap-typeahead').Typeahead
  }

  handleChange(e) {
    this.setState({ value: e.toString() })
  }

  render() {
    return (
      <div>
        <Typeahead
          labelKey={this.props.label}
          multiple=""
          options={this.props.list}
          placeholder={this.props.hint}
          onChange={event => this.handleChange(event)}
        />
      </div>
    )
  }
}
export default LiveSearch
