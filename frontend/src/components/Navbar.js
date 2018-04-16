import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Grid, Navbar as BootstrapNavbar } from 'react-bootstrap'
import { Link } from 'react-router-dom'
class Navbar extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { resetFormData } = this.props
    return (
      <BootstrapNavbar inverse fixedTop>
        <Grid>
          <BootstrapNavbar.Header>
            <BootstrapNavbar.Brand>
              <Link to="/">APR Pricing Tool</Link>
            </BootstrapNavbar.Brand>
            <BootstrapNavbar.Toggle />
          </BootstrapNavbar.Header>
        </Grid>
      </BootstrapNavbar>
    )
  }
}
// onClick={resetFormData}
export default Navbar
