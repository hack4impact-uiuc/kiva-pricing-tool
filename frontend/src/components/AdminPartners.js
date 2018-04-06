import React, { Component } from 'react'
import { Grid, Jumbotron, PageHeader, Bootstrap, Form } from 'react-bootstrap'
import './../styles/app.css'
import Button from './Button'
import LiveSearch from './LiveSearch'
import TextField from './TextField'
import ReactTable from 'react-table'
import 'react-table/react-table.css'

class AdminPartners extends Component {
  constructor(props) {
    super(props)
    this.state = {
      partner_names: [],
      data: [
        { partner: 'Google' },
        { partner: 'Facebook' },
        { partner: 'Amazon' },
        { partner: 'Uber' }
      ]
    }
    this.renderEditable = this.renderEditable.bind(this)
  }
  renderEditable(cellInfo) {
    return (
      <div
        style={{ backgroundColor: '#fafafa' }}
        contentEditable
        suppressContentEditableWarning
        onBlur={e => {
          const data = [...this.state.data]
          data[cellInfo.index][cellInfo.column.id] = e.target.innerHTML
          this.setState({ data })
        }}
        dangerouslySetInnerHTML={{
          __html: this.state.data[cellInfo.index][cellInfo.column.id]
        }}
      />
    )
  }
  render() {
    return (
      <Grid>
        <PageHeader>Admin Partners List</PageHeader>

        <Form inline>
          <h2>
            {' '}
            <small> Search Partners: </small>{' '}
          </h2>

          <LiveSearch
            ref="mfi"
            label="mfi"
            list={this.state.partner_names}
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
            limit="100"
            ref="addpartnername"
          />
        </Form>

        <Button
          name="Add "
          url="partnerlist"
          onClickHandler={() => {
            console.log('added new loan ')
          }}
        />

        <br />

        <ReactTable
          data={this.state.data}
          columns={[
            {
              Header: 'MFI Partner',
              accessor: 'partner',
              Cell: this.renderEditable
            },
            {
              header: 'Edit',
              id: 'edit-button',
              width: 150,
              Cell: props => <Button name="Edit" />
            },
            {
              header: 'Remove',
              id: 'delete-button',
              width: 150,
              Cell: props => <Button name="Remove" />
            }
          ]}
        />

        <Button
          name="Back"
          url="adminmain"
          onClickHandler={() => {
            console.log('going to admin main screen')
          }}
        />
      </Grid>
    )
  }
}

export default AdminPartners
