import React, { Component } from 'react'
import { Grid, PageHeader, Row, Col, Modal } from 'react-bootstrap'
import './../styles/app.css'
import Button from './Button'
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import axios from 'axios'
import { ToastContainer } from 'react-toastr'
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
      filtered: [],
      remove_warning: false,
      selected_remove: ''
    }
    this.renderEditable = this.renderEditable.bind(this)
    this.renderUnEditable = this.renderUnEditable.bind(this)
    this.saveAllPartners = this.saveAllPartners.bind(this)
  }

  cleanList() {
    for (var i = 0; i < this.state.data.length; i++) {
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
        style={{ backgroundColor: '#D2D2D2' }}
        contentEditable
        suppressContentEditableWarning
        onBlur={e => {
          const data = [...this.state.data]
          original = data[cellInfo.index][cellInfo.column.id]
          data[cellInfo.index][cellInfo.column.id] = e.target.innerHTML
          update = data[cellInfo.index][cellInfo.column.id]
          this.setState({ data })
          if (original !== update) {
            if (update && update.length !== 0 && update !== ' ') {
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

  saveAllPartners() {
    var updated_name = null
    if (this.state.edited_partners.length === 0) {
      container.warning(
        'There are no changes to save',
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
          .catch(error => {
            if (
              error.response.status === 422 ||
              error.response.status === 400
            ) {
              container.warning(
                'Changes to partner were not saved.',
                'One or more of edited partners already exists.',
                {
                  closeButton: true
                }
              )
            }
          })
      }
      container.success('Saved all partners', 'SUCCESS', { closeButton: true })
    }
  }

  addPartner(partner_name) {
    if (partner_name && partner_name.length) {
      let data = { partner_name: partner_name }
      axios
        .post('http://127.0.0.1:3453/addMFI', data)
        .then(response => {
          this.setState({
            data: this.state.data.concat({ partner_names: partner_name })
          })
          container.success('', 'Partner successfully added', {
            closeButton: true
          })
        })
        .catch(error => {
          if (error.response.status === 422) {
            container.warning(
              "The MFI partner '" + partner_name + "' already exists.",
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

  removePartner(partner_name) {
    this.setState({ remove_warning: false })
    // Remove partner from being visible from table, remove from state.data array if successful response from db
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

  handleRemoveClick(partner_name) {
    this.setState({ remove_warning: true, selected_remove: partner_name })
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
              Admin Partners List
            </PageHeader>
          </Col>
        </Row>

        <Row className="vertical-margin-item flex-align-bottom">
          <Col sm={6} md={6}>
            <h2>
              {' '}
              <small> Search Partners: </small>{' '}
            </h2>
            <div>
              <input
                className="expand-width"
                placeholder="Search MFI Partner"
                onChange={event =>
                  this.setState({
                    filtered: [
                      { id: 'partner_names', value: event.target.value }
                    ]
                  })
                }
                // onChange specifies the id of the column that is being filtered and gives string value to use for filtering
              />
            </div>
          </Col>
          <Col sm={5} md={5}>
            <h2>
              {' '}
              <small> Add Partner: </small>{' '}
            </h2>
            <input
              className="expand-width"
              type="text"
              label="Text"
              placeholder="Add MFI Partner"
              ref="addpartnername"
            />
          </Col>
          <Col sm={1} md={1}>
            <Button
              className="button-image-add"
              name="Add "
              url="partnerlist"
              onClickHandler={() => {
                this.addPartner(this.refs.addpartnername.value)
              }}
            />
          </Col>
        </Row>

        <Row className="vertical-margin-item">
          <Col sm={6} md={6}>
            <Button
              className="button-fancy"
              name="Edit List"
              url="partnerlist"
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
              url="partnerlist"
              onClickHandler={() => {
                this.setState({ editing: false })
                this.saveAllPartners()
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
                  Header: 'MFI Partner',
                  accessor: 'partner_names',
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
                        url="partnerlist"
                        onClickHandler={() =>
                          this.handleRemoveClick(original.partner_names)
                        } // Send text value to remove loan function
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
                  url="partnerlist"
                  onClickHandler={() =>
                    this.setState({ remove_warning: false })
                  }
                />
              </Col>
              <Col sm={6} md={6}>
                <Button
                  className="button-fancy"
                  name="Remove"
                  url="partnerlist"
                  onClickHandler={() =>
                    this.removePartner(this.state.selected_remove)
                  }
                />
              </Col>
            </Row>
          </Modal.Footer>
        </Modal>
      </Grid>
    )
  }
}

export default AdminPartners
