import React, { Component, View, StyleSheet } from 'react';
import { Link } from 'react-router-dom'
import { extent, max } from 'd3-array';
import { LineChart, Line, Bar, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Area, AreaChart, Legend, Treemap, PieChart, Pie } from 'recharts';
import { connect } from 'react-redux'

class KivaChart extends Component {
	constructor(props) {
	super(props)
	this.state = {
	data3: [{name: 'Group A', value: 400}, {name: 'Group B', value: 300},
            {name: 'Group C', value: 300}, {name: 'Group D', value: 200}],
	data2: [
	[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
	["1-Jan-2012", "2-Jan-2012", "3-Jan-2012", "4-Jan-2012", "5-Jan-2012", "6-Jan-2012", "7-Jan-2012", "8-Jan-2012", "9-Jan-2012", "10-Jan-2012", "11-Jan-2012", "12-Jan-2012", "13-Jan-2012"],
	[0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[5000, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[5000, 5000, 5000, 5000, 5000, 5000, 5000, 5000, 5000, 5000, 5000, 0, 0],
	[0, 0, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 0],
	[51, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
	[51, 51, 51, 51, 51, 51, 51, 51, 51, 51, 51, 0, 0],
	[0.51, 0.01, 6.01, 6.01, 6.01, 6.01, 6.01, 6.01, 6.01, 6.01, 6.01, 6.01, 0],
	[51, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
	[0, 0.0013972602739726028, 0.001424695815349972, 0.0014521321083860088, 0.0014795691531013073, 0.0015070069495164607, 0.0015344454976520638, 0.0015618847975287118, 0.0015893248491670002, 0.0016167656525875253, 0.001644207207810884, 0.0016716495148576733, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 61.01687894181993],
	[51, 52.001397260273976, 53.00282195608932, 54.00427408819771, 55.00575365735081, 56.007260664300325, 57.00879510979798, 58.010356994595504, 59.011946319444675, 60.01356308509726, 61.01520729230507, 61.01687894181993, 0],
	[4846.49, -53.01, -659.01, -659.01, -659.01, -659.01, -659.01, -659.01, -659.01, -659.01, -659.01, -545.99312105818, 0],
	],
	repaymentData: [],
	}
	}

	render() {
			let i;		
			for (i = 0; i < 13; i++) {
				this.state.repaymentData[i] = {principal: this.state.data2[5][i], interest: this.state.data2[6][i], taxes: this.state.data2[7][i], insurance: this.state.data2[8][i], fees: this.state.data2[9][i]} 
			}
			console.log(this.state.repaymentData);
			if (this.props.visualType == "bar") {
			return (
			<div>
			<BarChart width={600} height={400} data={this.state.repaymentData} margin={{top: 20, right: 10, left: 5, bottom: 5}}>
			   <CartesianGrid strokeDasharray="1 1"/>
			   <XAxis dataKey="name"/>
			   <YAxis/>
			   <Tooltip/>
			   <Legend />
			   <Bar dataKey="principal" stackId="a" fill="#82ca9d" />
			   <Bar dataKey="interest" stackId="a" fill="#8884d8" />
			   <Bar dataKey="taxes" stackId="a" fill="#82ca3d" />
			   <Bar dataKey="insurance" stackId="a" fill="#41ca3d" />
			   <Bar dataKey="fees" stackId="a" fill="#66ca3d" />
		    </BarChart>
			</div>
			)
			}
			if (this.props.visualType == "line") {
			return (
			<div>
	    	<LineChart width={600} height={400} data={this.state.repaymentData} margin={{top: 5, right: 30, left: 20, bottom: 5}}>
		    <XAxis dataKey="name"/>
		    <YAxis/>
		    <CartesianGrid strokeDasharray="3 3"/>
		    <Tooltip/>
			<Legend />
			<Line type="monotone" dataKey="interest" stroke="#8884d8" activeDot={{r: 8}}/>    
			<Line type="monotone" dataKey="principal" stroke="#82ca9d" />
			<Line type="monotone" dataKey="taxes" stroke="#8884d8" activeDot={{r: 8}}/>
			<Line type="monotone" dataKey="insurance" stroke="#82ca9d" />
			<Line type="monotone" dataKey="fees" stroke="#8884d8" activeDot={{r: 8}}/>
			</LineChart>
			</div>
			)
			}
			if (this.props.visualType == "pie") {
				return(
				<div>
		    	<PieChart width={350} height={300}>
				<Pie data={this.state.data3} cx={200} cy={100} outerRadius={60} fill="#8884d8"/>
				<Pie data={this.state.data3} cx={200} cy={100} innerRadius={70} outerRadius={80} fill="#82ca9d" label/>
	     	    </PieChart>
    			</div>
				)
			}
			if (this.props.visualType == "area") {
				return(
				<AreaChart width={600} height={400} data={this.state.repaymentData} margin={{top: 10, right: 30, left: 0, bottom: 0}}>
					<CartesianGrid strokeDasharray="3 3"/>
					<XAxis dataKey="name"/>
					<YAxis/>
					<Tooltip/>
					<Area type='monotone' dataKey='interest' stackId="1" stroke='#8884d8' fill='#8884d8' />
					<Area type='monotone' dataKey='principal' stackId="1" stroke='#82ca9d' fill='#82ca9d' />
					<Area type='monotone' dataKey='taxes' stackId="1" stroke='#ffc658' fill='#ffc658' />
				</AreaChart>
				)
			}
	}
}
export default KivaChart
