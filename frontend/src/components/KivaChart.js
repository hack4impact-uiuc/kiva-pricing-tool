import React, { Component } from 'react';
import { LineChart, Line, Bar, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

class KivaChart extends Component {
	constructor(props) {
	super(props)
	this.state = {
	data: [
      {name: 'Page A', principal: 4000, interest: 2400, taxes: 2400},
      {name: 'Page B', principal: 3000, interest: 1398, taxes: 2210},
      {name: 'Page C', principal: 2000, interest: 9800, taxes: 2290},
      {name: 'Page D', principal: 2780, interest: 3908, taxes: 2000},
      {name: 'Page E', principal: 1890, interest: 4800, taxes: 2181},
      {name: 'Page F', principal: 2390, interest: 3800, taxes: 2500},
      {name: 'Page G', principal: 3490, interest: 4300, taxes: 2100}
	]
	}
	}
	
	render() {
		return (
			<BarChart width={600} height={300} data={this.state.data} margin={{top: 20, right: 30, left: 20, bottom: 5}}>
			   <CartesianGrid strokeDasharray="3 3"/>
			   <XAxis dataKey="name"/>
			   <YAxis/>
			   <Tooltip/>
			   <Legend />
			   <Bar dataKey="interest" stackId="a" fill="#8884d8" />
			   <Bar dataKey="principal" stackId="a" fill="#82ca9d" />
			   <Bar dataKey="taxes" stackId="a" fill="#82ca3d" />
		  </BarChart>
		)
	}
}
export default KivaChart
