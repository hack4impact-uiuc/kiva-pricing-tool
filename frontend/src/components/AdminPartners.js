import React, { Component } from 'react'
import { Grid, PageHeader, Alert, Row, Col } from 'react-bootstrap'
import './../styles/app.css'
import Button from './Button'
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import axios from 'axios'
import ReactDOM from 'react-dom'
import { ToastContainer, ToastMessageAnimated } from 'react-toastr'
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
      filtered: []
    }
    this.renderEditable = this.renderEditable.bind(this)
    this.saveAllPartners = this.saveAllPartners.bind(this)
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
          if (
            original !== update &&
            update &&
            update.length != 0 &&
            update != ' '
          ) {
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
        }}
        dangerouslySetInnerHTML={{
          __html: this.state.data[cellInfo.index][cellInfo.column.id]
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
        })
        .catch(function(error) {
          console.log('error with adding')
        })
      this.setState({ addshow: true })
      container.success('', 'Partner successfully added', {
        closeButton: true
      })
    } else {
      container.warning('Please enter a name.', 'Cannot add empty name', {
        closeButton: true
      })
    }
  }

  removePartner(partner_name) {
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
    container.error('You have removed ' + partner_name, 'Partner Removed', {
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
                className="search-input"
                placeholder="Search MFI Partner"
                onChange={event =>
                  this.setState({
                    filtered: [
                      { id: 'partner_names', value: event.target.value }
                    ]
                  })}
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

        <ReactTable
          data={this.state.data}
          columns={[
            {
              Header: 'MFI Partner',
              accessor: 'partner_names',
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
                    url="partnerlist"
                    onClickHandler={() =>
                      this.removePartner(original.partner_names)} // Send text value to remove loan function
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
      </Grid>
    )
  }
}

export default AdminPartners
