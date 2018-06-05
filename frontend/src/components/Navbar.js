import React, { Component } from 'react'
import {
  Grid,
  Navbar as BootstrapNavbar,
  Nav,
  NavItem,
  NavDropdown,
  MenuItem
} from 'react-bootstrap'
import { LinkContainer, IndexLinkContainer } from 'react-router-bootstrap'
import './../styles/navbar.css'

// note: changed NavItem's component class because we cannot have nested <a>
class Navbar extends Component {
  resetData() {
    const { resetFormData } = this.props
    resetFormData()
  }

  render() {
    return (
      <Grid>
        <BootstrapNavbar fixedTop fluid className="custom-navbar-styles">
          <BootstrapNavbar.Toggle />
          <BootstrapNavbar.Collapse>
            <Nav>
              <IndexLinkContainer to="/" onClick={e => this.resetData()}>
                <NavItem>Home</NavItem>
              </IndexLinkContainer>

              <LinkContainer to="/newloan" onClick={e => this.resetData()}>
                <NavItem>New Loan</NavItem>
              </LinkContainer>

              <LinkContainer to="/findloan" onClick={e => this.resetData()}>
                <NavItem>Find Loan</NavItem>
              </LinkContainer>

              <NavDropdown id="adminToolNav" title="Admin Tools">
                <LinkContainer to="/partnerlist">
                  <MenuItem>Field Partner List</MenuItem>
                </LinkContainer>

                <LinkContainer to="/themelist">
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
