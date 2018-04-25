import React, { Component } from 'react'
import {
  Grid,
  Jumbotron,
  PageHeader,
  Bootstrap,
  Form,
  Alert
} from 'react-bootstrap'
import './../styles/app.css'
import Button from './Button'
import LiveSearch from './LiveSearch'
import TextField from './TextField'
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import axios from 'axios'
import ReactDOM from 'react-dom'
import { ToastContainer, ToastMessageAnimated } from 'react-toastr'
require('./../styles/react-toastr.css')
let container

class AdminPartners extends Component {
  constructor(props) {
    super(props)
    this.state = {
      partner_names: [],
      data: [],
      editing: false,
      edited_partners: [],
      filtered: []
    }
    this.renderEditable = this.renderEditable.bind(this)
    this.saveAllPartners = this.saveAllPartners.bind(this)
  }

  cleanList() {
    for (var i = 0; i < this.state.data.length; i++) {
      console.log(this.state.data[i])
      if (this.state.data[i].partner_names === '') {
        //Remove element in place, return array with element removed
        this.setState({
          data: this.state.data.slice(0, i).concat(this.state.data.slice(i + 1))
        })
      }
    }
  }

  componentDidMount() {
    axios.get('http://127.0.0.1:3453/getAllMFI').then(response => {
      this.setState({ partner_names: response.data.result.partners })
      for (let partner of this.state.partner_names) {
        this.setState({
          data: this.state.data.concat({ partner_names: partner })
        })
      }
    })
  }

  renderEditable(cellInfo) {
    var original = null
    var update = null
    return (
      <div
        style={{ backgroundColor: '#fafafa' }}
        contentEditable
        suppressContentEditableWarning
        onBlur={e => {
          const data = [...this.state.data]
          original = data[cellInfo.index][cellInfo.column.id]
          console.log(original)
          data[cellInfo.index][cellInfo.column.id] = e.target.innerHTML
          update = data[cellInfo.index][cellInfo.column.id]
          console.log(update)
          this.setState({ data })
          if (update != null && update.length != 0 && update != ' ') {
            this.setState({
              edited_partners: this.state.edited_partners.concat({
                original: original,
                update: update
              })
            })
          } else {
            container.warning(
              'Please refresh page and remove.',
              'Cannot edit empty cell',
              { closeButton: true }
            )
          }
        }}
        dangerouslySetInnerHTML={{
          __html: this.state.data[cellInfo.index][cellInfo.column.id]
        }}
      />
    )
  }

  saveAllPartners() {
    var updated_name = null
    if (this.state.edited_partners.length === 0) {
      container.warning(
        'There are no changes to edit',
        'Please edit before saving.',
        { closeButton: true }
      )
    } else {
      for (var i = 0; i < this.state.edited_partners.length; i++) {
        updated_name = {
          updated_partner_name: this.state.edited_partners[i].update
        }
        axios
          .put(
            'http://127.0.0.1:3453/editMFI/' +
              this.state.edited_partners[i].original,
            updated_name
          )
          .then(response => {
            for (var j = 0; i < this.state.edited_partners.length; j++) {
              if (
                this.state.edited_partners[j].update ===
                this.state.edited_partners[j].update
              ) {
                // Remove element in place, return array with element removed
                this.setState({
                  edited_partners: this.state.edited_partners
                    .slice(0, j)
                    .concat(this.state.data.slice(j + 1))
                })
              }
            }
          })
      }
      container.success('Saved all partners', 'SUCCESS', { closeButton: true })
    }
  }

  addPartner(partner_name) {
    if (
      partner_name != null &&
      partner_name.length != 0 &&
      partner_name != ' '
    ) {
      let data = { partner_name: partner_name }
      axios
        .post('http://127.0.0.1:3453/addMFI', data)
        .then(response => {
          this.setState({
            data: this.state.data.concat({ partner_names: partner_name })
          })
        })
        .catch(function(error) {
          console.log('error with adding')
        })
      this.setState({ addshow: true })
      container.success('', 'Partner successfully added', {
        closeButton: true
      })
    } else {
      container.warning('Please enter a name.', 'Cannot add empty name', {
        closeButton: true
      })
    }
  }

  removePartner(partner_name) {
    // Remove loan from being visible from table, remove from state.data array if successful response from db
    axios
      .delete('http://127.0.0.1:3453/removeMFI/' + partner_name)
      .then(response => {
        for (var i = 0; i < this.state.data.length; i++) {
          if (this.state.data[i].partner_names === partner_name) {
            // Remove element in place, return array with element removed
            this.setState({
              data: this.state.data
                .slice(0, i)
                .concat(this.state.data.slice(i + 1))
            })
          }
        }
      })
    container.error('You have removed ' + partner_name, 'Partner Removed', {
      closeButton: true
    })
  }

  render() {
    return (
      <Grid>
        <ToastContainer
          ref={ref => (container = ref)}
          className="toast-top-right"
        />

        <PageHeader>Admin Partners List</PageHeader>

        <Form inline>
          <h2>
            {' '}
            <small> Search Partners: </small>{' '}
          </h2>

          <LiveSearch
            ref="partner_names"
            label="partner_names"
            list={this.state.data}
            hint="Search MFI Partner"
          />
        </Form>

        <Form inline>
          <h2>
            {' '}
            <small> Add Partner: </small>{' '}
          </h2>

          <TextField
            id=""
            hint="Add MFI Partner"
            typeVal="String"
            limit="5000"
            ref="addpartnername"
          />
        </Form>

        <Button
          name="Add "
          url="partnerlist"
          onClickHandler={() =>
            this.addPartner(this.refs.addpartnername.state.textBody)}
        />

        <Button
          name="Edit List"
          url="partnerlist"
          onClickHandler={() => {
            this.setState({ editing: true })
            this.cleanList()
          }}
        />

        <Button
          name="Save List"
          url="partnerlist"
          onClickHandler={() => {
            this.setState({ editing: false })
            this.saveAllPartners()
          }}
        />

        <ReactTable
          data={this.state.data}
          columns={[
            {
              Header: 'MFI Partner',
              accessor: 'partner_names',
              Cell: this.state.editing ? this.renderEditable : null,
              filterMethod: (
                filter,
                row // Custom filter method for case insensitive filtering
              ) =>
                row[filter.id]
                  .toLowerCase()
                  .startsWith(filter.value.toLowerCase()) ||
                row[filter.id]
                  .toLowerCase()
                  .endsWith(filter.value.toLowerCase())
            },
            {
              Header: 'Remove',
              id: 'delete-button',
              width: 150,
              Cell: ({ row, original }) => {
                // Generate row such that value of text field is rememebered to pass into remove loan function
                return (
                  <Button
                    name="Remove"
                    url="partnerlist"
                    onClickHandler={() =>
                      this.removePartner(original.partner_names)} // Send text value to remove loan function
                  />
                )
              }
            }
          ]}
          filtered={this.state.filtered}
          defaultSorted={[
            {
              id: 'partner_names',
              desc: false
            }
          ]}
        />
      </Grid>
    )
  }
}

export default AdminPartners
