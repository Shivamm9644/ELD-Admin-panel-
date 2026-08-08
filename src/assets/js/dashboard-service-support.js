$(function () {
	"use strict";
	// chart 1
	var ctx = document.getElementById('chart1').getContext('2d');
	var myChart = new Chart(ctx, {
		type: 'bar',
		data: {
			labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"],
			datasets: [{
				label: 'Support Costs',
				data: [25, 23, 27, 15, 27, 23, 31, 41, 31, 25, 35],
				backgroundColor: 'rgba(0, 0, 0, 0.13)',
				borderColor: "transparent",
				borderWidth: 3
			}, {
				label: 'Revenue',
				type: 'line',
				data: [10, 8, 12, 5, 12, 8, 16, 25, 15, 10, 20],
				backgroundColor: "rgba(243, 38, 89, 0.36)",
				borderColor: "#f32659",
				pointBackgroundColor: 'transparent',
				pointHoverBackgroundColor: 'transparent',
				pointBorderWidth: 0,
				pointRadius: 0,
				pointHoverRadius: 0,
				borderWidth: 2
			}]
		},
		options: {
			maintainAspectRatio: false,
			legend: {
				display: true,
				labels: {
					fontColor: '#585757',
					boxWidth: 40
				}
			},
			tooltips: {
				displayColors: false
			},
			scales: {
				xAxes: [{
					barPercentage: .3,
					ticks: {
						beginAtZero: true,
						fontColor: '#585757'
					},
					gridLines: {
						display: true,
						color: "rgba(0, 0, 0, 0.05)"
					},
				}],
				yAxes: [{
					ticks: {
						beginAtZero: true,
						fontColor: '#585757'
					},
					gridLines: {
						display: true,
						color: "rgba(0, 0, 0, 0.05)"
					},
				}]
			}
		}
	});
	//pie
	$("span.pie").peity("pie", {
		width: 158,
		height: 158
	});
	//donut
	$("span.donut").peity("donut", {
		width: 158,
		height: 158
	});
});