import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  Grid,
  Navbar as BootstrapNavbar,
  Nav,
  NavItem,
  NavDropdown,
  MenuItem
} from 'react-bootstrap'
import { Link } from 'react-router-dom'
import './../styles/navbar.css'

class Navbar extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { resetFormData } = this.props
    return (
      <Grid>
        <BootstrapNavbar fixedTop fluid className="custom-navbar-styles">
          <BootstrapNavbar.Toggle />
          <Nav>
            <NavItem className="hover-fancy">
              <Link className="nav-white-link link-no-effect" to="/">
                Home
              </Link>
            </NavItem>
          </Nav>
          <BootstrapNavbar.Collapse>
            <Nav>
              <NavItem className="hover-fancy">
                <Link className="nav-white-link link-no-effect" to="newloan">
                  New Loan
                </Link>
              </NavItem>

              <NavItem className="hover-fancy">
                <Link className="nav-white-link link-no-effect" to="findloan">
                  Find Loan
                </Link>
              </NavItem>

              <NavDropdown className="hover-fancy" title="Admin Tools">
                <MenuItem>
                  <Link
                    className="nav-white-link link-no-effect"
                    to="partnerlist"
                  >
                    Partner List
                  </Link>
                </MenuItem>
                <MenuItem>
                  <Link
                    className="nav-white-link link-no-effect"
                    to="themelist"
                  >
                    Loan Theme List
                  </Link>
                </MenuItem>
              </NavDropdown>
            </Nav>
          </BootstrapNavbar.Collapse>
        </BootstrapNavbar>
      </Grid>
    )
  }
}
// onClick={resetFormData}
export default Navbar
