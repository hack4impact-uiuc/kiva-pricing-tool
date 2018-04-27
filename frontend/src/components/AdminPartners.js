//-------------------------------------------------------------------------
/**
 * Admin page where users are able to edit the list of partners
   within the database
 */
import React, { Component } from 'react'
import { Grid, PageHeader, Alert, Row, Col } from 'react-bootstrap'
import Button from './Button'
import ReactTable from 'react-table'
import axios from 'axios'
import ReactDOM from 'react-dom'
import { ToastContainer, ToastMessageAnimated } from 'react-toastr'
import './../styles/app.css'
import 'react-table/react-table.css'

//include to have proper Toastr formatting
require('./../styles/react-toastr.css')

//Toastr container that creates the ToastMessages
let container

class AdminPartners extends Component {
  constructor(props) {
    super(props)
    this.state = {
      partner_names: [], // list of partners in the database
      data: [], // list of partners used within this component
      editing: false, // current editable mode
      edited_partners: [], // the edited partners within this current list
      filtered: []
    }
    this.renderEditable = this.renderEditable.bind(this)
    this.saveAllPartners = this.saveAllPartners.bind(this)
  }

  //-------------------------------------------------------------------------
  /**
   * Removes empty values from the list when the user decides to edit
   */
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

  //-------------------------------------------------------------------------
  /**
   * Populates the partner list in this component
     with the partners in the database
   */
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

  //-------------------------------------------------------------------------
  /**
   * Based on whether "editing" is true or false, renders each cell editable
   When a cell is edited, it's original and updated value is added to the edited_partners
   in the component
   @param cellInfo current cell
   */
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
          data[cellInfo.index][cellInfo.column.id] = e.target.innerHTML
          update = data[cellInfo.index][cellInfo.column.id]
          this.setState({ data })

          //check to make sure update value is valid
          if (
            update != original &&
            update != null &&
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

  //-------------------------------------------------------------------------
  /**
   * Iterates through the edited partners and updates them in the database
    with an axios put request
   */
  saveAllPartners() {
    var updated_name = null
    if (this.state.edited_partners.length === 0) {
      container.warning(
        'There are no changes to edit',
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

  //-------------------------------------------------------------------------
  /**
   * Adds partner into the database
   @param partner_name name of partner
   */
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

  //-------------------------------------------------------------------------
  /**
   * removes partner from database
   @param partner_name partner to remove
   */
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

  //-------------------------------------------------------------------------
  /**
   * Renders elements on a page
   */
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

        <Row className="vertical-margin-item">
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
              />
            </div>
          </Col>
          <Col sm={5} md={5}>
            <h2>
              {' '}
              <small> Add Partner: </small>{' '}
            </h2>
            <input
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

        <Button
          name="Edit List"
          url="partnerlist"
          onClickHandler={() => {
            this.setState({ editing: true })
            this.cleanList()
          }}
        />

        <Button
          name="Save List"
          url="partnerlist"
          onClickHandler={() => {
            this.setState({ editing: false })
            this.saveAllPartners()
          }}
        />

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
