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
              <LinkContainer to="/">
                <NavItem>Home</NavItem>
              </LinkContainer>

              <LinkContainer to="newloan">
                <NavItem>New Loan</NavItem>
              </LinkContainer>

              <LinkContainer to="findloan">
                <NavItem>Find Loan</NavItem>
              </LinkContainer>

              <NavDropdown id="adminToolNav" title="Admin Tools">
                <LinkContainer to="partnerlist">
                  <MenuItem>Partner List</MenuItem>
                </LinkContainer>

                <LinkContainer to="themelist">
                  <MenuItem>Loan Theme List</MenuItem>
                </LinkContainer>
              </NavDropdown>
            </Nav>
          </BootstrapNavbar.Collapse>
        </BootstrapNavbar>
      </Grid>
    )
  }
}
export default Navbar
