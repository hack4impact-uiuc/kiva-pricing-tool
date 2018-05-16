import React, { Component } from 'react'
import { Grid, PageHeader, Row, Col } from 'react-bootstrap'
import './../styles/app.css'
import editimage from './../media/edit.jpg'
import magnifyingglassimage from './../media/magnifying-glass.jpg'
import toolsimage from './../media/tools.jpg'
import Button from './Button'

class IntroPage extends Component {
  componentDidMount() {
    const { resetFormData } = this.props
    resetFormData()
  }

  render() {
    return (
      <Grid fluid>
        <Row>
          <Col
            sm={12}
            md={12}
            className="bs-center solid-background-grey padded-element-vertical"
          >
            <PageHeader className="page-header-montserrat">
              APR Calculator
            </PageHeader>
            <p>
              Calculates and stores the APR Nominal Rate, presents a detailed
              Repayment Schedule, and displays a Loan Payment Visualization.
            </p>
          </Col>
        </Row>

        <Row>
          <Col sm={4} md={4} className="padded-element-vertical">
            <div className="img-container-center">
              <img src={editimage} alt="New Loan" />
            </div>
            <PageHeader className="page-header-montserrat padded-element-vertical bs-center">
              Create a Loan
            </PageHeader>
            <p className="padded-element-vertical padded-element-horizontal-lg bs-center">
              Create a new loan with a combination of inputs - fees, insurance,
              taxes, interest rate, etc.
            </p>
            <div className="bs-center padded-element-vertical">
              <Button className="button-fancy" name="New Loan" url="newloan" />
            </div>
          </Col>

          <Col sm={4} md={4} className="padded-element-vertical">
            <div className="img-container-center">
              <img src={magnifyingglassimage} alt="Find Loan" />
            </div>
            <PageHeader className="page-header-montserrat padded-element-vertical bs-center">
              Find a Loan
            </PageHeader>
            <p className="padded-element-vertical padded-element-horizontal-lg bs-center">
              Find a previously submitted loan. Either edit the found loan or
              create a new, duplicated version of the loan.
            </p>
            <div className="bs-center padded-element-vertical">
              <Button
                className="button-fancy"
                name="Find Loan"
                url="findloan"
              />
            </div>
          </Col>

          <Col sm={4} md={4} className="padded-element-vertical">
            <div className="img-container-center">
              <img src={toolsimage} alt="Admin Tools" />
            </div>
            <PageHeader className="page-header-montserrat padded-element-vertical bs-center">
              Admin Tools
            </PageHeader>
            <p className="padded-element-vertical padded-element-horizontal-lg bs-center">
              Add, remove, and edit the accessible Field partners and Loan Theme
              lists.
            </p>
            <div className="bs-center padded-element-vertical">
              <Button
                className="button-fancy"
                name="Admin Tools"
                url="partnerlist"
              />
            </div>
          </Col>
        </Row>
      </Grid>
    )
  }
}
export default IntroPage
