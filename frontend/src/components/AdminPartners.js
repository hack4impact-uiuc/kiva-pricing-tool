import React, { Component } from 'react'
import {
  Grid,
  Jumbotron,
  PageHeader,
  Bootstrap,
  Form,
  Alert,
  Row,
  Col
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

      addconfirm: false,
      adderror: false,
      removeshow: false,
      savesuccess: false,
      editing: false,
      edited_partners: [],
      addshow: false
    }
    this.renderEditable = this.renderEditable.bind(this)
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
          if (original != update) {
            //add
            let update_partner = { partner_name: update }
            axios
              .post('http://127.0.0.1:3453/addMFI', update_partner)
              .then(response => {
                this.setState({
                  data: this.state.data.concat({
                    partner_names: update_partner
                  })
                })
              })
              .catch(function(error) {
                console.log('error with adding' + error + update_partner)
              })

            //remove
            axios
              .delete('http://127.0.0.1:3453/removeMFI/' + original)
              .then(response => {
                for (var i = 0; i < this.state.data.length; i++) {
                  if (this.state.data[i].partner_names === original) {
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
        }}
        dangerouslySetInnerHTML={{
          __html: this.state.data[cellInfo.index][cellInfo.column.id]
        }}
      />
    )
  }

  addPartner(partner_name) {

    if (
      partner_name != null &&
      partner_name.length != 0 &&
      partner_name != ' '
    ) {
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
    }
  }

//     this.setState({ addshow: true })
//     let data = { partner_name: partner_name }
//     axios.post('http://127.0.0.1:3453/addMFI', data).then(response => {
//       this.setState({
//         data: this.state.data.concat({ partner_names: partner_name })
//       })
//     })
//   }



  removePartner(partner_name) {
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

  render() {
    return (
      <Grid className="padded-element-vertical">
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
                // onChange specifies the id of the column that is being filtered and gives string value to use for filtering
              />
            </div>
          </Col>
          <Col sm={5} md={5}>
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
          </Col>
          <Col sm={1} md={1}>
            <Button
              className="button-image-add"
              name="Add "
              url="partnerlist"
              onClickHandler={() => {
                this.addPartner(this.refs.addpartnername.state.textBody)
              }}
            />
          </Col>
        </Row>

        <Row>
          <Col sm={12} md={12}>
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
                  Cell: this.renderEditable
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
                        url="partnerlist"
                        onClickHandler={() =>
                          this.removeLoan(original.partner_names)} // Send text value to remove loan function
                      />
                    )
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
          </Col>
        </Row>

      </Grid>
    )
  }
}

export default AdminPartners
