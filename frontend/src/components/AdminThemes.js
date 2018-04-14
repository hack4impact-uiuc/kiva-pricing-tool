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
      data: []
    }

    this.renderUneditable = this.renderUneditable.bind(this)
  }

  componentDidMount() {
    axios.get('http://127.0.0.1:3453/getAllLT').then(response => {
      for (let theme of response.data.result.loan_theme) {
        this.setState({ data: this.state.data.concat({ loan_theme: theme }) })
      }
    })
  }

  removeLoan(theme_name) {
    axios
      .delete('http://127.0.0.1:3453/removeLT/' + theme_name)
      .then(response => {
        for (var i = 0; i < this.state.data.length; i++) {
          if (this.state.data[i].loan_theme === theme_name) {
            this.setState({
              data: this.state.data
                .slice(0, i)
                .concat(this.state.data.slice(i + 1))
            })
          }
        }
      })
  }

  addLoan(theme_name) {
    let data = { loan_theme: theme_name }
    axios.post('http://127.0.0.1:3453/addLT', data).then(response => {
      this.setState({
        data: this.state.data.concat({ loan_theme: theme_name })
      })
    })
  }

  renderUneditable(cellInfo) {
    return (
      <div
        //style={{ backgroundColor: '#fafafa' }}
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
            this.addLoan(this.refs.addloantheme.state.textBody)
          }}
        />

        <br />

        <ReactTable
          data={this.state.data}
          noDataText="Loading Loan Themes...This may take a moment"
          columns={[
            {
              Header: 'Loan Theme',
              accessor: 'loan_theme',
              id: 'loan_theme',
              Cell: this.renderUneditable,
              filterable: true
            },
            {
              Header: 'Edit',
              id: 'edit-button',
              width: 150,
              Cell: props => <Button name="Edit" />,
              filterable: false
            },
            {
              Header: 'Remove',
              id: 'delete-button',
              width: 150,
              Cell: ({ row, original }) => {
                return (
                  <Button
                    name="Remove"
                    url="themelist"
                    onClickHandler={() => this.removeLoan(original.loan_theme)}
                  />
                )
              },
              filterable: false
            }
          ]}
          defaultSorted={[
            {
              id: 'loan_theme',
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

export default AdminThemes
