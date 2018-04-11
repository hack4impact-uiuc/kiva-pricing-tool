import React, { Component } from 'react'
import { Grid, Jumbotron, PageHeader, Bootstrap, Form } from 'react-bootstrap'
import './../styles/app.css'
import Button from './Button'
import LiveSearch from './LiveSearch'
import TextField from './TextField'
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import axios from 'axios'

class AdminPartners extends Component {
  constructor(props) {
    super(props)
    this.state = {
      partner_names: [],
      data: []
    }
    this.renderEditable = this.renderEditable.bind(this)
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
    const listdata = this.state.data

    return (
      <Grid>
        <PageHeader>Admin Partners List</PageHeader>

        <Form inline>
          <h2>
            {' '}
            <small> Search Partners: </small>{' '}
          </h2>

          <LiveSearch
            ref="partner_names"
            label="partner_names"
            list={listdata}
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
            listdata.push({ partner: this.refs.addpartnername.state.textBody })
            console.log(this.refs.addpartnername.state.textBody)
          }}
        />

        <br />

        <ReactTable
          data={listdata}
          columns={[
            {
              Header: 'MFI Partner',
              accessor: 'partner_names',
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
            },
            {
              Header: 'TEST',
              id: 'test',
              Cell: ({ row, original }) => {
                return <span>{original.partner_names}</span>
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
