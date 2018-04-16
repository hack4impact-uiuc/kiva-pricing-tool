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

class AdminPartners extends Component {
  constructor(props) {
    super(props)
    this.state = {
      partner_names: [],
      data: [],
      addshow: false,
      removeshow: false
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

  addPartner(partner_name) {
    this.setState({ addshow: true })
    let data = { partner_name: partner_name }
    axios.post('http://127.0.0.1:3453/addMFI', data).then(response => {
      this.setState({
        data: this.state.data.concat({ partner_names: partner_name })
      })
    })
  }

  removeLoan(partner_name) {
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

  confirmAdd() {
    ReactDOM.render(
      <Alert bsStyle="success">
        <h4>Add Successful!</h4>
      </Alert>,
      document.getElementById('root')
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
            this.addPartner(this.refs.addpartnername.state.textBody)
          }}
        />

        {this.state.addshow == true ? (
          <Alert bsStyle="success">
            <h4>Add Successful!</h4>
          </Alert>
        ) : null}

        {this.state.removeshow == true ? (
          <Alert bsStyle="danger">
            <h4>Partner Removed!</h4>
          </Alert>
        ) : null}

        <br />

        <ReactTable
          data={this.state.data}
          columns={[
            {
              Header: 'MFI Partner',
              accessor: 'partner_names',
              Cell: this.renderEditable
            },
            {
              Header: 'Edit',
              id: 'edit-button',
              width: 150,
              Cell: props => <Button name="Edit" />
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
                      this.removeLoan(original.partner_names)} // Send text value to remove loan function
                  />
                )
              }
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
