import React, { Component } from 'react'
import {
  Grid,
  Jumbotron,
  PageHeader,
  Bootstrap,
  Form,
  Row,
  Col
} from 'react-bootstrap'
import './../styles/app.css'
import Button from './Button'
import TextField from './TextField'
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import axios from 'axios'

class AdminThemes extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [], // Data retrieved from db
      filtered: [] // ID and text data used for filtering react table
    }

    this.renderUneditable = this.renderUneditable.bind(this)
  }

  // ------------------------------------------------------ HELPER METHODS --------------------------------------------------------
  componentDidMount() {
    // Get all loan themes from database, populate data in state if response successful
    axios.get('http://127.0.0.1:3453/getAllLT').then(response => {
      // Loop through response array to insert correctly formatted data into state.data array ( {loan_theme: THEME NAME} )
      for (let theme of response.data.result.loan_theme) {
        this.setState({
          data: this.state.data.concat({ loan_theme: theme })
        })
      }
    })
  }

  removeLoan(theme_name) {
    // Remove loan from being visible from table, remove from state.data array if successful response from db
    axios
      .delete('http://127.0.0.1:3453/removeLT/' + theme_name)
      .then(response => {
        for (var i = 0; i < this.state.data.length; i++) {
          if (this.state.data[i].loan_theme === theme_name) {
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

  addLoan(theme_name) {
    // Add loan to database and data table, add to state.data array if response successful
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

  // ------------------------------------------------------ RENDER ELEMENTS --------------------------------------------------------
  render() {
    return (
      <Grid className="padded-element-vertical">
        <Row>
          <Col sm={12} md={12}>
            <PageHeader className="page-header-montserrat bs-center">
              Loan Theme List
            </PageHeader>
          </Col>
        </Row>

        <Row className="vertical-margin-item">
          <Col sm={6} md={6}>
            <h2>
              {' '}
              <small> Search Themes: </small>{' '}
            </h2>

            <div>
              <input
                className="search-input"
                placeholder="Search Loan Theme"
                onChange={event =>
                  this.setState({
                    filtered: [{ id: 'loan_theme', value: event.target.value }]
                  })}
                // onChange specifies the id of the column that is being filtered and gives string value to use for filtering
              />
            </div>
          </Col>
          <Col sm={5} md={5}>
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
          </Col>
          <Col sm={1} md={1}>
            <Button
              className="button-image-add"
              name="Add"
              url="themelist"
              onClickHandler={() => {
                this.addLoan(this.refs.addloantheme.state.textBody)
              }}
            />
          </Col>
        </Row>

        <Row>
          <Col sm={12} md={12}>
            <ReactTable
              data={this.state.data}
              noDataText="No Results Found." // Text displayed when no data is in the table
              loadingText="Loading themes...This may take a moment." // Text displayed when data is being loaded
              columns={[
                {
                  Header: 'Loan Theme',
                  accessor: 'loan_theme',
                  Cell: this.renderUneditable,
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
                  Header: 'Edit',
                  id: 'edit-button',
                  width: 150,
                  Cell: props => (
                    <Button className="button-image-edit" name="Edit" />
                  )
                },
                {
                  Header: 'Remove',
                  id: 'delete-button',
                  width: 150,
                  Cell: ({ row, original }) => {
                    // Generate row such that value of text field is rememebered to pass into remove loan function
                    return (
                      <Button
                        className="button-image-remove"
                        name="Remove"
                        url="themelist"
                        onClickHandler={() =>
                          this.removeLoan(original.loan_theme)} // Send text value to remove loan function
                      />
                    )
                  }
                }
              ]}
              // Allow react table to use state.filterable to filter correct column based on state.filterable id and value
              filtered={this.state.filtered}
              defaultSorted={[
                // Sort table alphabetically
                {
                  id: 'loan_theme',
                  desc: false
                }
              ]}
            />
          </Col>
        </Row>
      </Grid>
    )
  }
}

export default AdminThemes
