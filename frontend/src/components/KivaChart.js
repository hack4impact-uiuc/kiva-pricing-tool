// import React, { Component } from 'react'
// //import { Bar } from '@vx/shape';
// import { Group } from '@vx/group'
// import { GradientTealBlue } from '@vx/gradient'
// import { letterFrequency } from '@vx/mock-data'
// import { scaleBand, scaleLinear } from '@vx/scale'
// import { extent, max } from 'd3-array'
// import { appleStock } from '@vx/mock-data'
// import {
//   LineChart,
//   Line,
//   Bar,
//   BarChart,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   Treemap,
//   PieChart,
//   Pie
// } from 'recharts'
//
// class KivaChart extends Component {
//   constructor(props) {
//     super(props)
//     this.state = {
//       data: [
//         { name: '1', principal: 4000, interest: 2400, taxes: 2400 },
//         { name: '2', principal: 3000, interest: 1398, taxes: 2210 },
//         { name: '3', principal: 2000, interest: 9800, taxes: 2290 },
//         { name: '4', principal: 2780, interest: 3908, taxes: 2000 },
//         { name: '5', principal: 1890, interest: 4800, taxes: 2181 },
//         { name: '6', principal: 2390, interest: 3800, taxes: 2500 },
//         { name: 'Page G', principal: 3490, interest: 4300, taxes: 2100 },
//         { name: 'Page A', principal: 4000, interest: 2400, taxes: 2400 },
//         { name: 'Page B', principal: 3000, interest: 1398, taxes: 2210 },
//         { name: 'Page C', principal: 2000, interest: 9800, taxes: 2290 },
//         { name: 'Page D', principal: 2780, interest: 3908, taxes: 2000 },
//         { name: 'Page E', principal: 1890, interest: 4800, taxes: 2181 },
//         { name: 'Page F', principal: 2390, interest: 3800, taxes: 2500 },
//         { name: 'Page G', principal: 3490, interest: 4300, taxes: 2100 },
//         { name: 'Page A', principal: 4000, interest: 2400, taxes: 2400 },
//         { name: 'Page B', principal: 3000, interest: 1398, taxes: 2210 },
//         { name: 'Page C', principal: 2000, interest: 9800, taxes: 2290 },
//         { name: 'Page D', principal: 2780, interest: 3908, taxes: 2000 },
//         { name: 'Page E', principal: 1890, interest: 4800, taxes: 2181 },
//         { name: 'Page F', principal: 2390, interest: 3800, taxes: 2500 },
//         { name: 'Page G', principal: 3490, interest: 4300, taxes: 2100 },
//         { name: 'Page A', principal: 4000, interest: 2400, taxes: 2400 },
//         { name: 'Page B', principal: 3000, interest: 1398, taxes: 2210 },
//         { name: 'Page C', principal: 2000, interest: 9800, taxes: 2290 },
//         { name: 'Page D', principal: 2780, interest: 3908, taxes: 2000 },
//         { name: 'Page E', principal: 1890, interest: 4800, taxes: 2181 },
//         { name: 'Page F', principal: 2390, interest: 3800, taxes: 2500 },
//         { name: 'Page G', principal: 3490, interest: 4300, taxes: 2100 },
//         { name: 'Page A', principal: 4000, interest: 2400, taxes: 2400 },
//         { name: 'Page B', principal: 3000, interest: 1398, taxes: 2210 },
//         { name: 'Page C', principal: 2000, interest: 9800, taxes: 2290 },
//         { name: 'Page D', principal: 2780, interest: 3908, taxes: 2000 },
//         { name: 'Page E', principal: 1890, interest: 4800, taxes: 2181 },
//         { name: 'Page F', principal: 2390, interest: 3800, taxes: 2500 },
//         { name: 'Page G', principal: 3490, interest: 4300, taxes: 2100 },
//         { name: 'Page A', principal: 4000, interest: 2400, taxes: 2400 },
//         { name: 'Page B', principal: 3000, interest: 1398, taxes: 2210 },
//         { name: 'Page C', principal: 2000, interest: 9800, taxes: 2290 },
//         { name: 'Page D', principal: 2780, interest: 3908, taxes: 2000 },
//         { name: 'Page E', principal: 1890, interest: 4800, taxes: 2181 },
//         { name: 'Page F', principal: 2390, interest: 3800, taxes: 2500 },
//         { name: 'Page G', principal: 3490, interest: 4300, taxes: 2100 }
//       ]
//     }
//   }
//
//   render() {
//     if (this.props.visualType == 'bar') {
//       return (
//         <div>
//           <BarChart
//             width={600}
//             height={300}
//             data={this.state.data}
//             margin={{ top: 20, right: 10, left: 5, bottom: 5 }}
//           >
//             <CartesianGrid strokeDasharray="1 1" />
//             <XAxis dataKey="name" />
//             <YAxis />
//             <Tooltip />
//             <Legend />
//             <Bar dataKey="interest" stackId="a" fill="#8884d8" />
//             <Bar dataKey="principal" stackId="a" fill="#82ca9d" />
//             <Bar dataKey="taxes" stackId="a" fill="#82ca3d" />
//             <Bar dataKey="insurance" stackId="a" fill="#41ca3d" />
//             <Bar dataKey="fees" stackId="a" fill="#66ca3d" />
//           </BarChart>
//         </div>
//       )
//     }
//     if (this.props.visualType == 'line') {
//       return (
//         <div>
//           <LineChart
//             width={600}
//             height={300}
//             data={this.state.data}
//             margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
//           >
//             <XAxis dataKey="name" />
//             <YAxis />
//             <CartesianGrid strokeDasharray="3 3" />
//             <Tooltip />
//             <Legend />
//             <Line
//               type="monotone"
//               dataKey="pv"
//               stroke="#8884d8"
//               activeDot={{ r: 8 }}
//             />
//             <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
//           </LineChart>
//         </div>
//       )
//     }
//     if (this.props.visualType == 'pie') {
//       return (
//         <div>
//           <PieChart width={800} height={400}>
//             <Pie
//               data={this.state.data}
//               cx={200}
//               cy={200}
//               outerRadius={60}
//               fill="#8884d8"
//             />
//             <Pie
//               data={this.state.data}
//               cx={200}
//               cy={200}
//               innerRadius={70}
//               outerRadius={90}
//               fill="#82ca9d"
//               label
//             />
//           </PieChart>
//         </div>
//       )
//     }
//     if (this.props.visualType == 'tree') {
//       return (
//         <div>
//           <Treemap
//             width={400}
//             height={200}
//             data={this.state.data}
//             dataKey="size"
//             ratio={4 / 3}
//             stroke="#fff"
//             fill="#8884d8"
//           />
//         </div>
//       )
//     }
//   }
// }
// export default KivaChart
