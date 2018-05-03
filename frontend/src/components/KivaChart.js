import React, { Component, View, StyleSheet } from 'react';
import { Link } from 'react-router-dom'
import { extent, max } from 'd3-array';
import { RadialBarChart, RadialBar, LineChart, Line, Bar, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Area, AreaChart, Legend, Treemap, PieChart, Pie } from 'recharts';
import { connect } from 'react-redux'
import { APRRateDisplay } from './'

class KivaChart extends Component {
	constructor(props) {
	super(props)
	this.state = {
	data3: [{name: 'Group A', value: 400}, {name: 'Group B', value: 300},
            {name: 'Group C', value: 300}, {name: 'Group D', value: 200}],
	repaymentData: [],
	}
	}
	render() {
		if (this.props.name == "paymentChart") {
			let i;		
			for (i = 0; i < 13; i++) {
				this.state.repaymentData[i] = {periodNum: i, principal: this.props.data[5][i], interest: this.props.data[6][i], taxes: this.props.data[7][i], insurance: this.props.data[8][i], fees: this.props.data[9][i]}; 
			}
			console.log(this.state.repaymentData);
		}
		else if (this.props.name == "balanceChart") {
			let i;		
			for (i = 0; i < 13; i++) {
				this.state.repaymentData[i] = {periodNum: i, balance: this.props.data[5][i]}; 
			}
			console.log(this.state.repaymentData);			
		}
		
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
		   <XAxis dataKey="periodNum"/>
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
	    <XAxis dataKey="periodNum"/>
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
     	 	    <XAxis dataKey="periodNum"/>
			</AreaChart>
			)
		}
		if (this.props.visualType == "radial") {
			return (
			<div>
			<RadialBarChart width={500} height={300} cx={150} cy={150} innerRadius={20} outerRadius={140} barSize={10} data={this.state.repaymentData}>
			<RadialBar minAngle={15} label={{ position: 'insideStart', fill: '#fff' }} background clockWise={true} dataKey='interest'/>
			<RadialBar minAngle={15} label={{ position: 'insideStart', fill: '#fff' }} background clockWise={true} dataKey='principal'/>
			<RadialBar minAngle={15} label={{ position: 'insideStart', fill: '#fff' }} background clockWise={true} dataKey='insurance'/>
			<RadialBar minAngle={15} label={{ position: 'insideStart', fill: '#fff' }} background clockWise={true} dataKey='taxes'/>
			<RadialBar minAngle={15} label={{ position: 'insideStart', fill: '#fff' }} background clockWise={true} dataKey='fees'/>
			</RadialBarChart>
			</div>
			)
		}
	}
}
export default KivaChart
