$(function () {
	"use strict";
	// easy pie chart 
	$('.easy-dash-chart1').easyPieChart({
		easing: 'easeOutBounce',
		barColor: '#3b5998',
		lineWidth: 10,
		trackColor: 'rgba(0, 0, 0, 0.08)',
		scaleColor: false,
		onStep: function (from, to, percent) {
			$(this.el).find('.w_percent').text(Math.round(percent));
		}
	});
	$('.easy-dash-chart2').easyPieChart({
		easing: 'easeOutBounce',
		barColor: '#55acee',
		lineWidth: 10,
		trackColor: 'rgba(0, 0, 0, 0.08)',
		scaleColor: false,
		onStep: function (from, to, percent) {
			$(this.el).find('.w_percent').text(Math.round(percent));
		}
	});
	$('.easy-dash-chart3').easyPieChart({
		easing: 'easeOutBounce',
		barColor: '#e52d27',
		lineWidth: 10,
		trackColor: 'rgba(0, 0, 0, 0.08)',
		scaleColor: false,
		onStep: function (from, to, percent) {
			$(this.el).find('.w_percent').text(Math.round(percent));
		}
	});
	// worl map
	jQuery('#dashboard-map').vectorMap({
		map: 'world_mill_en',
		backgroundColor: 'transparent',
		borderColor: '#818181',
		borderOpacity: 0.25,
		borderWidth: 1,
		zoomOnScroll: false,
		color: '#009efb',
		regionStyle: {
			initial: {
				fill: '#14abef'
			}
		},
		markerStyle: {
			initial: {
				r: 9,
				'fill': '#fff',
				'fill-opacity': 1,
				'stroke': '#000',
				'stroke-width': 5,
				'stroke-opacity': 0.4
			},
		},
		enableZoom: true,
		hoverColor: '#009efb',
		markers: [{
			latLng: [21.00, 78.00],
			name: 'Lorem Ipsum Dollar'
		}],
		hoverOpacity: null,
		normalizeFunction: 'linear',
		scaleColors: ['#b6d6ff', '#005ace'],
		selectedColor: '#c9dfaf',
		selectedRegions: [],
		showTooltip: true,
	});
	$("#trendchart1").sparkline([5, 8, 7, 10, 9, 10, 8, 6, 4, 6, 8, 7, 6, 8, 9, 10, 8], {
		type: 'bar',
		height: '20',
		barWidth: '2',
		resize: true,
		barSpacing: '3',
		barColor: '#eb5076'
	});
	$("#trendchart2").sparkline([5, 8, 7, 10, 9, 10, 8, 6, 4, 6, 8, 7, 6, 8, 9, 10, 8], {
		type: 'bar',
		height: '20',
		barWidth: '2',
		resize: true,
		barSpacing: '3',
		barColor: '#14abef'
	});
	$("#trendchart3").sparkline([5, 8, 7, 10, 9, 10, 8, 6, 4, 6, 8, 7, 6, 8, 9, 10, 8], {
		type: 'bar',
		height: '20',
		barWidth: '2',
		resize: true,
		barSpacing: '3',
		barColor: '#02ba5a'
	});
	$("#trendchart4").sparkline([5, 8, 7, 10, 9, 10, 8, 6, 4, 6, 8, 7, 6, 8, 9, 10, 8], {
		type: 'bar',
		height: '20',
		barWidth: '2',
		resize: true,
		barSpacing: '3',
		barColor: '#d13adf'
	});
	$("#trendchart5").sparkline([5, 8, 7, 10, 9, 10, 8, 6, 4, 6, 8, 7, 6, 8, 9, 10, 8], {
		type: 'bar',
		height: '20',
		barWidth: '2',
		resize: true,
		barSpacing: '3',
		barColor: '#000000'
	});
	// chart 5
	var options = {
		chart: {
			height: 250,
			type: 'radialBar',
			toolbar: {
				show: false
			}
		},
		plotOptions: {
			radialBar: {
				//startAngle: -135,
				//endAngle: 225,
				hollow: {
					margin: 0,
					size: '70%',
					background: 'transparent',
					image: undefined,
					imageOffsetX: 0,
					imageOffsetY: 0,
					position: 'front',
					dropShadow: {
						enabled: true,
						top: 3,
						left: 0,
						blur: 4,
						opacity: 0.24
					}
				},
				track: {
					background: '#ebebeb',
					strokeWidth: '67%',
					margin: 0, // margin is in pixels
					dropShadow: {
						enabled: false,
						top: -3,
						left: 0,
						blur: 4,
						color: '#843cf7',
						opacity: 0.55
					}
				},
				dataLabels: {
					showOn: 'always',
					name: {
						offsetY: -5,
						show: true,
						color: '#843cf7',
						fontSize: '14px'
					},
					value: {
						formatter: function (val) {
							return val + "%";
						},
						color: '#843cf7',
						fontSize: '20px',
						show: true,
						offsetY: 10,
					}
				}
			}
		},
		fill: {
			type: 'gradient',
			gradient: {
				shade: 'light',
				type: 'horizontal',
				shadeIntensity: 0.5,
				gradientToColors: ['#843cf7'],
				inverseColors: false,
				opacityFrom: 1,
				opacityTo: 1,
				stops: [0, 100]
			}
		},
		colors: ["#843cf7"],
		series: [65],
		stroke: {
			lineCap: 'round'
		},
		labels: ['Total'],
	}
	var chart = new ApexCharts(document.querySelector("#data-chart-5"), options);
	chart.render();
});