import React, { Component } from 'react'
import {
  Grid,
  Navbar as BootstrapNavbar,
  Nav,
  NavItem,
  NavDropdown,
  MenuItem
} from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
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

          <BootstrapNavbar.Collapse>
            <Nav>
              <LinkContainer className="nav-white-link link-no-effect" to="/">
                <NavItem className="hover-fancy">Home</NavItem>
              </LinkContainer>
              <LinkContainer
                className="nav-white-link link-no-effect"
                to="newloan"
              >
                <NavItem className="hover-fancy nav-white-link">
                  New Loan
                </NavItem>
              </LinkContainer>
              <LinkContainer
                className="nav-white-link link-no-effect"
                to="findloan"
              >
                <NavItem className="hover-fancy">Find Loan</NavItem>
              </LinkContainer>

              <NavDropdown
                className="hover-fancy"
                id="adminToolNav"
                title="Admin Tools"
              >
                <MenuItem componentClass="span">
                  <Link
                    className="link-no-effect dropdown-link"
                    to="partnerlist"
                  >
                    Partner List
                  </Link>
                </MenuItem>

                <MenuItem componentClass="span">
                  <Link className="link-no-effect dropdown-link" to="themelist">
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
