import React, { Component } from 'react'
import { Grid, Jumbotron, PageHeader, Bootstrap, Form } from 'react-bootstrap'
import './../styles/app.css'
import Button from './Button'
import LiveSearch from './LiveSearch'
import TextField from './TextField'
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import axios from 'axios'

class AdminThemes extends Component {
  constructor(props) {
    super(props)
    this.state = {
      theme_data: [],
      data: []
    }

    this.renderEditable = this.renderEditable.bind(this)
  }

  componentDidMount() {
    axios.get('http://127.0.0.1:3453/getAllLT').then(response => {
      this.setState({ theme_data: response.data.result.loan_theme })
      for (let theme of this.state.theme_data) {
        this.setState({ data: this.state.data.concat({ loan_theme: theme }) })
      }
    })
  }

  removeLoan(theme_name) {
    axios
      .delete('http://127.0.0.1:3453/removeMFI/' + theme_name)
      .then(response => {
        this.componentDidMount
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
    return (
      <Grid>
        <PageHeader>Loan Theme List</PageHeader>
        <Form inline>
          <h2>
            {' '}
            <small> Search Themes: </small>{' '}
          </h2>

          <LiveSearch
            ref="loan_theme"
            label="loan_theme"
            list={this.state.data}
            hint="Search Loan Themes"
          />
        </Form>

        <Form inline>
          <h2>
            {' '}
            <small> Add Loan Theme: </small>{' '}
          </h2>

          <TextField
            id=""
            hint="Add Loan Theme"
            typeVal="String"
            limit="100"
            ref="addloantheme"
          />
        </Form>

        <Button
          name="Add "
          url="themelist"
          onClickHandler={() => {
            console.log('added new theme')
          }}
        />

        <br />

        <ReactTable
          data={this.state.data}
          columns={[
            {
              Header: 'Loan Theme',
              accessor: 'loan_theme',
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
              Cell: props => (
                <Button
                  name="Remove"
                  url="themelist"
                  onClickHandler={() => this.removeLoan(this.Cell)}
                />
              )
            },
            {
              Header: 'TEST',
              id: 'test',
              Cell: ({ row, original }) => {
                return <span>{original.loan_theme}</span>
              }
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

export default AdminThemes
