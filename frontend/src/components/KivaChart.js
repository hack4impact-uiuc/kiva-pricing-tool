import React, { Component } from 'react'
import {
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
  Legend
} from 'recharts'
import { Variables } from '../utils'

class KivaChart extends Component {
  constructor(props) {
    super(props)
    this.state = {
      repaymentData: []
    }
  }
  render() {
    if (this.props.id === 'Payment Chart') {
      this.state.repaymentData = []
      for (let i = 0; i < this.props.data[0].length; i++) {
        this.state.repaymentData[i] = {
          periodNum: i,
          principal: this.props.data[4][i],
          interest: this.props.data[6][i],
          taxes: this.props.data[7][i],
          insurance: this.props.data[8][i],
          fees: this.props.data[9][i],
          security_deposit: this.props.data[10][i]
        }
      }
      if (this.props.visualType === 'Bar') {
        return (
          <BarChart
            width={600}
            height={400}
            data={this.state.repaymentData}
            margin={{ top: 20, right: 10, left: 5, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="5 5" />
            <XAxis dataKey="periodNum" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="principal"
              stackId="a"
              fill={Variables.principalChartColor}
            />
            <Bar
              dataKey="interest"
              stackId="a"
              fill={Variables.interestChartColor}
            />
            <Bar dataKey="taxes" stackId="a" fill={Variables.taxesChartColor} />
            <Bar
              dataKey="insurance"
              stackId="a"
              fill={Variables.taxesChartColor}
            />
            <Bar dataKey="fees" stackId="a" fill={Variables.feesChartColor} />
            <Bar
              dataKey="security_deposit"
              stackId="a"
              fill={Variables.securityChartColor}
            />
          </BarChart>
        )
      }
      if (this.props.visualType === 'Line') {
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
            <Line type="monotone" dataKey="principal" stroke="#c94473" />
            <Line
              type="monotone"
              dataKey="interest"
              stroke={Variables.interestChartColor}
              activeDot={{ r: 8 }}
            />
            <Line
              type="monotone"
              dataKey="taxes"
              stroke="#95c5dd"
              activeDot={{ r: 8 }}
            />
            <Line
              type="monotone"
              dataKey="insurance"
              stroke={Variables.insuranceChartColor}
            />
            <Line
              type="monotone"
              dataKey="fees"
              stroke={Variables.feesChartColor}
              activeDot={{ r: 8 }}
            />
            <Line type="monotone" dataKey="security_deposit" stroke="#7EBC89" />
          </LineChart>
        )
      }
      if (this.props.visualType === 'Area') {
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
              dataKey="principal"
              stackId="1"
              stroke={Variables.principalChartColor}
              fill={Variables.principalChartColor}
            />
            <Area
              type="monotone"
              dataKey="interest"
              stackId="1"
              stroke={Variables.interestChartColor}
              fill={Variables.interestChartColor}
            />
            <Area
              type="monotone"
              dataKey="taxes"
              stackId="1"
              stroke={Variables.taxesChartColor}
              fill={Variables.taxesChartColor}
            />
            <Area
              type="monotone"
              dataKey="insurance"
              stackId="1"
              stroke={Variables.insuranceChartColor}
              fill={Variables.insuranceChartColor}
            />
            <Area
              type="monotone"
              dataKey="fees"
              stackId="1"
              stroke={Variables.feesChartColor}
              fill={Variables.feesChartColor}
            />
            <Area
              type="monotone"
              dataKey="security_deposit"
              stackId="1"
              stroke={Variables.securityChartColor}
              fill={Variables.securityChartColor}
            />
          </AreaChart>
        )
      }
    } else if (this.props.id === 'Balance Chart') {
      this.state.repaymentData = []
      for (let i = 0; i < this.props.data[0].length; i++) {
        this.state.repaymentData[i] = {
          periodNum: i,
          balance: this.props.data[5][i]
        }
      }
      if (this.props.visualType === 'Bar') {
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
            <Bar dataKey="balance" stackId="a" fill="#9ae395" />
          </BarChart>
        )
      }
      if (this.props.visualType === 'Line') {
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
            <Line type="monotone" dataKey="balance" stroke="#9ae395" />
          </LineChart>
        )
      }
      if (this.props.visualType === 'Area') {
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
              dataKey="balance"
              stackId="1"
              stroke="#000000"
              fill="#9ae395"
            />
          </AreaChart>
        )
      }
    }
  }
}
export default KivaChart
