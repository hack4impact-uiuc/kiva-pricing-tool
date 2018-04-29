import React, { Component } from 'react'
import { Grid, PageHeader, Alert, Row, Col, Modal } from 'react-bootstrap'
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
      edited_loans: [],
      remove_warning: false,
      selected_remove: ''
    }
    this.renderEditable = this.renderEditable.bind(this)
    this.renderUnEditable = this.renderUnEditable.bind(this)
    this.saveAllTheme = this.saveAllTheme.bind(this)
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
          if (
            original !== update &&
            update &&
            update.length != 0 &&
            update != ' '
          ) {
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

  renderUnEditable(cellInfo) {
    return (
      <div
        onBlur={e => {
          const data = [...this.state.data]
          data[cellInfo.index][cellInfo.column.id] = e.target.innerHTML
        }}
        dangerouslySetInnerHTML={{
          __html: this.state.data[cellInfo.index][cellInfo.column.id].trim()
        }}
      />
    )
  }

  saveAllTheme() {
    var updated_name = null
    if (this.state.edited_loans.length === 0) {
      container.warning(
        'There are no changes to save',
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
          container.success(``, 'Theme successfully added', {
            closeButton: true
          })
        })
        .catch(error => {
          if (error.response.status === 422) {
            container.warning(
              "The loan theme '" + theme_name + "' already exists.",
              'Already Exists',
              {
                closeButton: true
              }
            )
          }
        })
    } else {
      container.warning('Please enter a name.', 'Cannot add empty name', {
        closeButton: true
      })
    }
  }

  removeTheme(theme_name) {
    this.setState({ remove_warning: false })
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
                .concat(this.state.data.slice(i + 1)),
              selected_remove: ''
            })
          }
        }
      })
    container.error('You have removed ' + theme_name, 'Theme Removed', {
      closeButton: true
    })
  }

  handleRemoveClick(theme_name) {
    this.setState({ remove_warning: true, selected_remove: theme_name })
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

        <Row className="vertical-margin-item flex-align-bottom">
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
                this.addTheme(this.refs.addTheme.value)
              }}
            />
          </Col>
        </Row>

        <Row className="vertical-margin-item">
          <Col sm={6} md={6}>
            <Button
              className="button-fancy"
              name="Edit List"
              url="themelist"
              onClickHandler={() => {
                this.setState({ editing: true })
                this.cleanList()
              }}
            />
          </Col>
          <Col sm={6} md={6} className="bs-button-right">
            <Button
              className="button-fancy"
              name="Save List"
              url="themelist"
              onClickHandler={() => {
                this.setState({ editing: false })
                this.saveAllTheme()
              }}
            />
          </Col>
        </Row>

        <Row>
          <Col sm={12} md={12}>
            <ReactTable
              data={this.state.data}
              columns={[
                {
                  Header: 'Loan Theme',
                  accessor: 'loan_theme',
                  Cell: this.state.editing
                    ? this.renderEditable
                    : this.renderUnEditable,
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
                          this.handleRemoveClick(original.loan_theme)} // Send text value to remove loan function
                      />
                    )
                  }
                }
              ]}
              filtered={this.state.filtered}
              defaultSorted={[
                {
                  id: 'loan_theme',
                  desc: false
                }
              ]}
            />
          </Col>
        </Row>

        <Modal show={this.state.remove_warning} enforceFocus>
          <Modal.Header>
            <Modal.Title>
              <h4>Remove Element Warning</h4>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="bs-center">
            <p className="large-font">
              Are you sure you want to remove "{this.state.selected_remove}"?
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Row>
              <Col sm={6} md={6} className="bs-left">
                <Button
                  className="button-fancy"
                  name="Cancel"
                  url="themelist"
                  onClickHandler={() =>
                    this.setState({ remove_warning: false })}
                />
              </Col>
              <Col sm={6} md={6}>
                <Button
                  className="button-fancy"
                  name="Remove"
                  url="themelist"
                  onClickHandler={() =>
                    this.removeTheme(this.state.selected_remove)}
                />
              </Col>
            </Row>
          </Modal.Footer>
        </Modal>
      </Grid>
    )
  }
}

export default AdminThemes
