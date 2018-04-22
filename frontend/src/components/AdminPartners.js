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
import { ToastContainer, ToastMessage } from 'react-toastr'
//import "./../demo.css"
import 'react-toastr/demo.css'
//require("./../demo.css");
let container

class AdminPartners extends Component {
  constructor(props) {
    super(props)
    this.state = {
      partner_names: [],
      data: [],
      addconfirm: false,
      adderror: false,
      removeshow: false,
      savesuccess: false,
      editing: false,
      edited_partners: []
    }
    this.renderEditable = this.renderEditable.bind(this)
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
          if (original != update) {
            //add
            let partner = { partner_name: update }
            console.log(partner.partner_name + 'hi')
            axios
              .post('http://127.0.0.1:3453/addMFI', partner)
              // .then(
              //         response => {
              //   this.setState({
              //     data: this.state.data.concat({
              //       partner_names: update
              //     })
              //   })
              // })
              .catch(function(error) {
                console.log('error with adding' + error + partner)
              })

            //remove
            axios
              .delete('http://127.0.0.1:3453/removeMFI/' + original)
              .then(response => {
                for (var i = 0; i < this.state.data.length; i++) {
                  if (this.state.data[i].partner_names === original) {
                    // Remove element in place, return array with element removed
                    this.setState({
                      data: this.state.data
                        .slice(0, i)
                        .concat(this.state.data.slice(i + 1))
                    })
                  }
                }
              })
          }
        }}
        dangerouslySetInnerHTML={{
          __html: this.state.data[cellInfo.index][cellInfo.column.id]
        }}
      />
    )
  }

  addPartner(partner_name) {
    if (
      partner_name != null &&
      partner_name.length != 0 &&
      partner_name != ' '
    ) {
      let data = { partner_name: partner_name }
      console.log(data.partner_name + 'helo')
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
    }
  }

  removePartner(partner_name) {
    this.setState({ removeshow: true })
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
  }

  savePartner() {
    this.setState({ editing: false })
    console.log('yay')
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
          onClickHandler={() => {
            this.addPartner(this.refs.addpartnername.state.textBody)
          }}
        />

        {this.state.addshow == true ? (
          <Alert bsStyle="success" closeLabel="close">
            <h4>Add Successful</h4>
          </Alert>
        ) : null}

        {this.state.adderror == true ? (
          <Alert bsStyle="warning">
            <h4>Partner Already Exists</h4>
          </Alert>
        ) : null}

        {this.state.removeshow == true ? (
          <Alert bsStyle="warning" closeLabel="close">
            <h4>Partner Removed</h4>
          </Alert>
        ) : null}

        <Button
          name="Edit List"
          url="partnerlist"
          onClickHandler={() => {
            this.setState({ editing: true })
            this.cleanList()
          }}
        />

        <Button
          name="TEST"
          url="partnerlist"
          onClickHandler={() =>
            container.success(`hi! Now is ${new Date()}`, `///title\\\\\\`, {
              closeButton: true
            })} // Send text value to remove loan function
        />

        <ReactTable
          data={this.state.data}
          columns={[
            {
              Header: 'MFI Partner',
              accessor: 'partner_names',
              Cell: this.state.editing ? this.renderEditable : null
            },
            {
              Header: '',
              id: 'save-button',
              width: 150,
              Cell: ({ row, original }) => {
                // Generate row such that value of text field is rememebered to pass into remove loan function
                if (this.state.editing) {
                  return (
                    <Button
                      name="Save"
                      url="partnerlist"
                      onClickHandler={() => this.setState({ editing: false })}
                    />
                  )
                }
              }
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
