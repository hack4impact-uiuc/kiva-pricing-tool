import React, { Component, View, StyleSheet } from 'react'
import { Link } from 'react-router-dom'
import { extent, max } from 'd3-array'
import {
  RadialBarChart,
  RadialBar,
  LineChart,
  Line,
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Area,
  AreaChart,
  Legend,
  Treemap,
  PieChart,
  Pie
} from 'recharts'
import { connect } from 'react-redux'
import { APRRateDisplay } from './'

class KivaChart extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data3: [
        { name: 'Group A', value: 400 },
        { name: 'Group B', value: 300 },
        { name: 'Group C', value: 300 },
        { name: 'Group D', value: 200 }
      ],
      repaymentData: [],
      principalBalance: ''
    }
  }

  render() {
    if (this.props.id == 'Payment Chart') {
      let i
      this.state.repaymentData = []
      this.state.principalBalance = 'principal'
      for (i = 0; i < 13; i++) {
        this.state.repaymentData[i] = {
          periodNum: i + 1,
          principal: this.props.data[4][i],
          interest: this.props.data[6][i],
          taxes: this.props.data[7][i],
          insurance: this.props.data[8][i],
          fees: this.props.data[9][i],
          securityDeposit: this.props.data[10][i]
        }
      }
    } else if (this.props.id == 'Balance Chart') {
      let i
      this.state.repaymentData = []
      this.state.principalBalance = 'balance'
      for (i = 0; i < 13; i++) {
        this.state.repaymentData[i] = {
          periodNum: i + 1,
          balance: this.props.data[5][i]
        }
      }
    }
    if (this.props.visualType == 'bar') {
      return (
        <BarChart
          width={600}
          height={400}
          data={this.state.repaymentData}
          margin={{ top: 20, right: 10, left: 5, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="1 1" />
          <XAxis dataKey="periodNum" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar
            dataKey={this.state.principalBalance}
            stackId="a"
            fill="#c94473"
          />
          <Bar dataKey="interest" stackId="a" fill="#a044c9" />
          <Bar dataKey="taxes" stackId="a" fill="#95c5dd" />
          <Bar dataKey="insurance" stackId="a" fill="#34bf60" />
          <Bar dataKey="fees" stackId="a" fill="#bfa434" />
          <Bar dataKey="security deposit" stackId="a" fill="#66ca3d" />
        </BarChart>
      )
    } else if (this.props.visualType == 'line') {
      return (
        <LineChart
          width={600}
          height={400}
          data={this.state.repaymentData}
          margin={{ top: 20, right: 10, left: 5, bottom: 5 }}
        >
          <XAxis dataKey="periodNum" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="interest"
            stroke="#c94473"
            activeDot={{ r: 8 }}
          />
          <Line
            type="monotone"
            dataKey={this.state.principalBalance}
            stroke="#a044c9"
          />
          <Line
            type="monotone"
            dataKey="taxes"
            stroke="#95c5dd"
            activeDot={{ r: 8 }}
          />
          <Line type="monotone" dataKey="insurance" stroke="#34bf60" />
          <Line
            type="monotone"
            dataKey="fees"
            stroke="#bfa434"
            activeDot={{ r: 8 }}
          />
          <Line type="monotone" dataKey="security deposit" stroke="#66ca3d" />
        </LineChart>
      )
    } else if (this.props.visualType == 'area') {
      return (
        <AreaChart
          width={600}
          height={400}
          data={this.state.repaymentData}
          margin={{ top: 20, right: 10, left: 5, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="periodNum" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Area
            type="monotone"
            dataKey="interest"
            stackId="1"
            stroke="#c94473"
            fill="#c94473"
          />
          <Area
            type="monotone"
            dataKey={this.state.principalBalance}
            stackId="1"
            stroke="#a044c9"
            fill="#a044c9"
          />
          <Area
            type="monotone"
            dataKey="taxes"
            stackId="1"
            stroke="#95c5dd"
            fill="#95c5dd"
          />
          <Area
            type="monotone"
            dataKey="fees"
            stackId="1"
            stroke="#34bf60"
            fill="#34bf60"
          />
          <Area
            type="monotone"
            dataKey="insurance"
            stackId="1"
            stroke="#bfa434"
            fill="#bfa434"
          />
          <Area
            type="monotone"
            dataKey="security deposit"
            stackId="1"
            stroke="#66ca3d"
            fill="#66ca3d"
          />
        </AreaChart>
      )
    }
  }
}

export default KivaChart
