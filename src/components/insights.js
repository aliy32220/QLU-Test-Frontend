import React from 'react';
import { Doughnut } from 'react-chartjs-2'; 
import {Chart, ArcElement} from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels';
import axios from 'axios';
import ReactLoading from "react-loading";
axios.defaults.headers.get['Access-Control-Allow-Origin'] = '*';
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
Chart.register(ArcElement);   
Chart.register(ChartDataLabels);
<script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels@0.7.0"></script>
class Analytics extends React.Component {
	componentDidMount() {
			this.fetchChartData();
		}
	constructor(props) {
		super(props);
		this.fetchChartData = this.fetchChartData.bind(this);
        this.state = {
	        loading : true,
			completed : 0,
			pending : 0,
            totalTasks : 0,
			chart : null,
			doughnatChartData : [],
        }
		this.doughnutChart = {
			data: {
				labels: ['Completed', 'Pending'],
				datasets: [{
					data: [this.state.completed, this.state.pending],
					backgroundColor: ['rgba(185, 255, 242, 0.7)', 'rgba(52, 181, 58, 0.7)'],
					borderColor: ['#B9FFF2', '#34B53A'],
					borderWidth: 2,
					label: 'My Tasks'
				}]
			},
			options: {
				responsive: true, 
				maintainAspectRatio: false,
                plugins: {
                    datalabels: {
                        formatter: function(value, context) {
                            return context.chart.data.labels[context.dataIndex];
                        },
                        color: ['#36A2EB', 'Red']
                    }
                }
			}
		}
    }
	fetchChartData() {
        axios({
          method: "GET",
          url: `http://localhost:5050/api/tasks/published`,
        }).then((res) => {
			const completed_tasks = res.data.length;
            axios({
                method: "GET",
                url: `http://localhost:5050/api/tasks`,
              }).then((res) => {
                  const total_tasks = res.data.length;
                  const pending_tasks = total_tasks - completed_tasks
                  this.setState({loading : false})
                  this.state.completed = completed_tasks;
                  this.state.pending = pending_tasks;
                  this.state.totalTasks = total_tasks;
                  this.doughnutChart.data.datasets[0].data[0] = this.state.completed;
                  this.doughnutChart.data.datasets[0].data[1] = this.state.pending;
            });
        });
      };
    render() {
		const {loading, completed, pending, totalTasks} = this.state;
		return (
			<div className = "row" style = {{margin: '100px 30px 30px 30px', justifyContent: 'center'}}>
				{loading ?
				<div style = {{ margin: '100px 20spx 30px 200px'}}>  
                <ReactLoading width={100} type={"spinningBubbles"} color="#000" />
                </div> :
					<div className = "row" style = {{margin: '0px 0px 0px 0px', justifyContent: 'center'}}>
						<div className = "col-6" style = {{border: '1px solid #b4b4b4', margin: '10px'}}>
							<Doughnut id='doughnatChart' data={this.doughnutChart.data} options={this.doughnutChart.options} />
						</div>
                        <div>
                            <span color='Red'> <b> Total Tasks:</b>{totalTasks}</span> <span style={{color: '#36A2EB', backgroundColor: 'White', paddingLeft:'100'}}><b>Completed:</b> {completed}</span> <span style={{color: 'Red', backgroundColor: 'White'}} ><b>Pending:</b> {pending}</span>

                        </div>
                </div>}
            </div>
        )
    }
}
export default Analytics;