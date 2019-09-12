import React, { Component } from 'react';
import {Bar, Doughnut} from 'react-chartjs-2';
import '../style/Chart.css';

const titles = {
	"RunScored" : "Total Runs Scored Against Each Country",
	"Wins": "Total Victories Against Each Conutry",
	"Stats": "Winning Statistics for all the Played Matches",
	"Scores": "Total Batting Statistics of his Career",
	"InningWinCount" : "Matches Won When Played at 1st vs 2nd : Highest Win Count When Played 2nd",
	"Ground" : "Matches Won on Each Ground"
}


class Chart extends Component {

  render() {
		let chartData = {
			"labels": [],
			"datasets": [
				{
					"label": '',
					"data": [],
					"backgroundColor": []
				}
			]
		}

		for(let key in this.props){
			chartData.datasets[0].label = titles[key];
			if(typeof this.props[key] === 'object'){
				let subProps = this.props[key];
				console.log(subProps)
				for(let _key in subProps){
					chartData.labels.push(_key);
					chartData.datasets[0].data.push(subProps[_key])
				}
			} else {
				chartData.datasets[0].data.push(this.props[key])
			}
		}

		const getRand = (max) => {
		  return Math.floor(Math.random() * Math.floor(max)) + ',';
		}

		chartData.datasets[0].data.forEach((e) => {
			chartData.datasets[0].backgroundColor.push('rgba('+getRand(255)+getRand(255)+getRand(255) + '0.6)');
		});

		let chart = (
			<Bar
				data={chartData}
				width={50}
				height={50}
				options={{
					scales: {
						yAxes: [{
								ticks: {
										fontSize: 20,
										stepSize: 10
								}
						}]
					}
				}}
			/>
		);

		if(chartData.datasets[0].data.length > 5){
			chart = (
				<Doughnut
					data={chartData}
					width={50}
					height={50}
					options={{
						scales: {
			        yAxes: [{
			            ticks: {
			                display: false
			            }
			        }],
							xAxes: [{
			            ticks: {
			                display: false
			            }
			        }]
				    }
					}}
				/>
			)
		}

		return (
			<div className="block">
				<h3>{chartData.datasets[0].label}</h3>
				{chart}
			</div>
		)
  }
}

export default Chart;
