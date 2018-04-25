import React, { Component } from 'react'
import { Grid, PageHeader, Row, Col } from 'react-bootstrap'
import './../styles/app.css'
import Button from './Button'
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import axios from 'axios'
import { ToastContainer, ToastMessage } from 'react-toastr'
require('./../styles/react-toastr.css')
let container

class AdminThemes extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      filtered: [], // ID and text data used for filtering react table
      editing: false,
      edited_loans: []
    }
    this.renderEditable = this.renderEditable.bind(this)
  }

  cleanList() {
    for (var i = 0; i < this.state.data.length; i++) {
      console.log(this.state.data[i])
      if (this.state.data[i].loan_theme === '') {
        //Remove element in place, return array with element removed
        this.setState({
          data: this.state.data.slice(0, i).concat(this.state.data.slice(i + 1))
        })
      }
    }
  }

  componentDidMount() {
    axios.get('http://127.0.0.1:3453/getAllLT').then(response => {
      for (let theme of response.data.result.loan_theme) {
        this.setState({
          data: this.state.data.concat({ loan_theme: theme })
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
              edited_loans: this.state.edited_loans.concat({
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

  saveAllTheme() {
    var updated_name = null
    if (this.state.edited_loans.length === 0) {
      container.warning(
        'There are no changes to edit',
        'Please edit before saving.',
        { closeButton: true }
      )
    } else {
      for (var i = 0; i < this.state.edited_loans.length; i++) {
        updated_name = {
          updated_partner_name: this.state.edited_loans[i].update
        }
        axios
          .put(
            'http://127.0.0.1:3453/editMFI/' +
              this.state.edited_loans[i].original,
            updated_name
          )
          .then(response => {
            for (var j = 0; i < this.state.edited_loans.length; j++) {
              if (
                this.state.edited_loans[j].update ===
                this.state.edited_loans[j].update
              ) {
                // Remove element in place, return array with element removed
                this.setState({
                  edited_loans: this.state.edited_loans
                    .slice(0, j)
                    .concat(this.state.data.slice(j + 1))
                })
              }
            }
          })
      }
      container.success('Saved all themes', 'SUCCESS', { closeButton: true })
    }
  }

  addTheme(theme_name) {
    if (theme_name && theme_name.length) {
      let data = { loan_theme: theme_name }
      axios
        .post('http://127.0.0.1:3453/addLT', data)
        .then(response => {
          this.setState({
            data: this.state.data.concat({ loan_theme: theme_name })
          })
        })
        .catch(function(error) {
          console.log('error with adding')
        })
      this.setState({ addshow: true })
      container.success(``, 'Theme successfully added', {
        closeButton: true
      })
    } else {
      container.warning('Please enter a name.', 'Cannot add empty name', {
        closeButton: true
      })
    }
  }

  removeTheme(theme_name) {
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
    container.error('You have removed ' + theme_name, 'Theme Removed', {
      closeButton: true
    })
  }

  render() {
    return (
      <Grid className="padded-element-vertical">
        <ToastContainer
          ref={ref => (container = ref)}
          className="toast-top-right"
        />

        <Row>
          <Col sm={12} md={12}>
            <PageHeader className="page-header-montserrat bs-center">
              Admin Theme List
            </PageHeader>
          </Col>
        </Row>

        <Row className="vertical-margin-item">
          <Col sm={6} md={6}>
            <h2>
              {' '}
              <small> Search Loan Themes: </small>{' '}
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
              <small> Add Theme: </small>{' '}
            </h2>
            <input
              className="expand-width"
              type="text"
              label="Text"
              placeholder="Add Loan Theme"
              ref="addTheme"
            />
          </Col>
          <Col sm={1} md={1}>
            <Button
              className="button-image-add"
              name="Add "
              url="themelist"
              onClickHandler={() => {
                this.addTheme(this.refs.addpartnername.value)
              }}
            />
          </Col>
        </Row>

        <Button
          name="Edit List"
          url="themelist"
          onClickHandler={() => {
            this.setState({ editing: true })
            this.cleanList()
          }}
        />

        <Button
          name="Save List"
          url="themelist"
          onClickHandler={() => {
            this.setState({ editing: false })
            this.saveAllLoans()
          }}
        />

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
