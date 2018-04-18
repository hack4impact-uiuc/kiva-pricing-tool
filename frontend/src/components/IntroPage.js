import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  Grid,
  Jumbotron,
  PageHeader,
  Bootstrap,
  Row,
  Col
} from 'react-bootstrap'
import './../styles/app.css'
import Button from './Button'

class IntroPage extends Component {
  constructor(props) {
    super(props)
  }

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
          <Col sm={4} md={4}>
            <p>
              Lorem ipsum dolor sit amet, id fastidii detraxit sententiae per.
              Id has deserunt omittantur, sonet legimus civibus an mel. At
              noluisse reprehendunt his. Lorem convenire vulputate nec ei, nisl
              principes gubergren pro in. Affert soleat voluptua sea te, ne
              decore tempor oportere nam. Ad illum ponderum singulis mea. Qui
              autem fabulas ad, usu porro legere vidisse ea.
            </p>
          </Col>

          <Col sm={4} md={4}>
            <p>
              Lorem ipsum dolor sit amet, id fastidii detraxit sententiae per.
              Id has deserunt omittantur, sonet legimus civibus an mel. At
              noluisse reprehendunt his. Lorem convenire vulputate nec ei, nisl
              principes gubergren pro in. Affert soleat voluptua sea te, ne
              decore tempor oportere nam. Ad illum ponderum singulis mea. Qui
              autem fabulas ad, usu porro legere vidisse ea.
            </p>
          </Col>

          <Col sm={4} md={4}>
            <p>
              Lorem ipsum dolor sit amet, id fastidii detraxit sententiae per.
              Id has deserunt omittantur, sonet legimus civibus an mel. At
              noluisse reprehendunt his. Lorem convenire vulputate nec ei, nisl
              principes gubergren pro in. Affert soleat voluptua sea te, ne
              decore tempor oportere nam. Ad illum ponderum singulis mea. Qui
              autem fabulas ad, usu porro legere vidisse ea.
            </p>
          </Col>
        </Row>

        <Row>
          <Col sm={4} md={4}>
            <Button
              name="New Loan"
              url="newloan"
              onClickHandler={() => {
                console.log('going to new loan')
              }}
            />
          </Col>

          <Col sm={4} md={4}>
            <Button
              name="Find Loan"
              url="findloan"
              onClickHandler={() => {
                console.log('going to find loan')
              }}
            />
          </Col>

          <Col sm={4} md={4}>
            <Button
              name="Admin Tools"
              url="adminmain"
              onClickHandler={() => {
                console.log('going to admin tools')
              }}
            />
          </Col>
        </Row>
      </Grid>
    )
  }
}
export default IntroPage
