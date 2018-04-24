import React, { Component } from 'react'
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

// note: changed NavItem's component class because we cannot have nested <a>
class Navbar extends Component {
  render() {
    const { resetFormData } = this.props
    return (
      <Grid>
        <BootstrapNavbar fixedTop fluid className="custom-navbar-styles">
          <BootstrapNavbar.Toggle />
          <Nav>
            <NavItem className="hover-fancy " componentClass="span">
              <Link className="nav-white-link link-no-effect" to="/">
                Home
              </Link>
            </NavItem>
          </Nav>
          <BootstrapNavbar.Collapse>
            <Nav>
              <NavItem className="hover-fancy" componentClass="span">
                <Link className="nav-white-link link-no-effect" to="newloan">
                  New Loan
                </Link>
              </NavItem>

              <NavItem className="hover-fancy" componentClass="span">
                <Link className="nav-white-link link-no-effect" to="findloan">
                  Find Loan
                </Link>
              </NavItem>

              <NavDropdown
                className="hover-fancy"
                id="adminToolNav"
                title="Admin Tools"
              >
                <MenuItem componentClass="span">
                  <Link
                    className="nav-white-link link-no-effect"
                    to="partnerlist"
                  >
                    Partner List
                  </Link>
                </MenuItem>
                <MenuItem componentClass="span">
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
export default Navbar
