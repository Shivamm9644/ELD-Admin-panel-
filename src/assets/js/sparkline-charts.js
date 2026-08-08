$(function () {
	"use strict";
	window.Apex = {
		stroke: {
			width: 3
		},
		markers: {
			size: 0
		},
		tooltip: {
			fixed: {
				enabled: true,
			}
		}
	};
	var randomizeArray = function (arg) {
			var array = arg.slice();
			var currentIndex = array.length,
				temporaryValue, randomIndex;
			while (0 !== currentIndex) {
				randomIndex = Math.floor(Math.random() * currentIndex);
				currentIndex -= 1;
				temporaryValue = array[currentIndex];
				array[currentIndex] = array[randomIndex];
				array[randomIndex] = temporaryValue;
			}
			return array;
		}
		// data for the sparklines that appear below header area
	var sparklineData = [47, 45, 54, 38, 56, 24, 65, 31, 37, 39, 62, 51, 35, 41, 35, 27, 93, 53, 61, 27, 54, 43, 19, 46];
	var spark1 = {
		chart: {
			foreColor: 'rgba(0, 0, 0, 0.85)',
			type: 'area',
			height: 160,
			sparkline: {
				enabled: true
			},
		},
		stroke: {
			width: 2,
			curve: 'straight'
		},
		fill: {
			type: 'gradient',
			gradient: {
				shade: 'dark',
				gradientToColors: ['#2af598'],
				shadeIntensity: 1,
				type: 'horizontal',
				opacityFrom: 1,
				opacityTo: 1,
				stops: [0, 100, 100, 100]
			},
		},
		colors: ["#009efd"],
		dataLabels: {
			enabled: false
		},
		tooltip: {
			enabled: true,
			theme: 'dark',
		},
		series: [{
			data: randomizeArray(sparklineData)
		}],
		yaxis: {
			min: 0
		},
		title: {
			text: '$424,652',
			offsetX: 0,
			style: {
				fontSize: '24px',
				cssClass: 'apexcharts-yaxis-title'
			}
		},
		subtitle: {
			text: 'Sales',
			offsetX: 0,
			style: {
				fontSize: '14px',
				cssClass: 'apexcharts-yaxis-title'
			}
		}
	}
	var spark2 = {
		chart: {
			foreColor: 'rgba(0, 0, 0, 0.85)',
			type: 'area',
			height: 160,
			sparkline: {
				enabled: true
			},
		},
		stroke: {
			width: 2,
			curve: 'straight'
		},
		fill: {
			type: 'gradient',
			gradient: {
				shade: 'dark',
				gradientToColors: ['#ffb199'],
				shadeIntensity: 1,
				type: 'horizontal',
				opacityFrom: 1,
				opacityTo: 1,
				stops: [0, 100, 100, 100]
			},
		},
		colors: ["#ff0844"],
		dataLabels: {
			enabled: false
		},
		tooltip: {
			enabled: true,
			theme: 'dark',
		},
		series: [{
			data: randomizeArray(sparklineData)
		}],
		yaxis: {
			min: 0
		},
		title: {
			text: '$235,312',
			offsetX: 0,
			style: {
				fontSize: '24px',
				cssClass: 'apexcharts-yaxis-title'
			}
		},
		subtitle: {
			text: 'Expenses',
			offsetX: 0,
			style: {
				fontSize: '14px',
				cssClass: 'apexcharts-yaxis-title'
			}
		}
	}
	var spark3 = {
		chart: {
			foreColor: 'rgba(0, 0, 0, 0.85)',
			type: 'area',
			height: 160,
			sparkline: {
				enabled: true
			},
		},
		stroke: {
			width: 2,
			curve: 'straight'
		},
		fill: {
			type: 'gradient',
			gradient: {
				shade: 'dark',
				gradientToColors: ['#f7b733'],
				shadeIntensity: 1,
				type: 'horizontal',
				opacityFrom: 1,
				opacityTo: 1,
				stops: [0, 100, 100, 100]
			},
		},
		colors: ["#fc4a1a"],
		dataLabels: {
			enabled: false
		},
		tooltip: {
			enabled: true,
			theme: 'dark',
		},
		series: [{
			data: randomizeArray(sparklineData)
		}],
		xaxis: {
			crosshairs: {
				width: 1
			},
		},
		yaxis: {
			min: 0
		},
		title: {
			text: '$135,965',
			offsetX: 0,
			style: {
				fontSize: '24px',
				cssClass: 'apexcharts-yaxis-title'
			}
		},
		subtitle: {
			text: 'Profits',
			offsetX: 0,
			style: {
				fontSize: '14px',
				cssClass: 'apexcharts-yaxis-title'
			}
		}
	}
	var spark1 = new ApexCharts(document.querySelector("#spark1"), spark1);
	spark1.render();
	var spark2 = new ApexCharts(document.querySelector("#spark2"), spark2);
	spark2.render();
	var spark3 = new ApexCharts(document.querySelector("#spark3"), spark3);
	spark3.render();
	var options1 = {
		chart: {
			type: 'line',
			width: '100%',
			height: 55,
			sparkline: {
				enabled: true
			}
		},
		fill: {
			type: 'gradient',
			gradient: {
				shade: 'dark',
				gradientToColors: ['#f1076f'],
				shadeIntensity: 1,
				type: 'horizontal',
				opacityFrom: 1,
				opacityTo: 1,
				stops: [0, 100, 100, 100]
			},
		},
		colors: ["#ff5447"],
		series: [{
			name: 'Sales',
			data: [25, 66, 41, 89, 63, 25, 44, 12, 36, 9, 54]
		}],
		tooltip: {
			theme: 'dark',
			x: {
				show: false
			},
		}
	}
	var options2 = {
		chart: {
			type: 'line',
			width: '100%',
			height: 55,
			sparkline: {
				enabled: true
			}
		},
		fill: {
			type: 'gradient',
			gradient: {
				shade: 'dark',
				gradientToColors: ['#08a50e'],
				shadeIntensity: 1,
				type: 'horizontal',
				opacityFrom: 1,
				opacityTo: 1,
				stops: [0, 100, 100, 100]
			},
		},
		colors: ["#cddc35"],
		series: [{
			name: 'Expenses',
			data: [12, 14, 2, 47, 42, 15, 47, 75, 65, 19, 14]
		}],
		tooltip: {
			theme: 'dark',
			x: {
				show: false
			},
		}
	}
	var options3 = {
		chart: {
			type: 'line',
			width: '100%',
			height: 55,
			sparkline: {
				enabled: true
			}
		},
		fill: {
			type: 'gradient',
			gradient: {
				shade: 'dark',
				gradientToColors: ['#11998e'],
				shadeIntensity: 1,
				type: 'horizontal',
				opacityFrom: 1,
				opacityTo: 1,
				stops: [0, 100, 100, 100]
			},
		},
		colors: ["#38ef7d"],
		series: [{
			name: 'Profits',
			data: [47, 45, 74, 14, 56, 74, 14, 11, 7, 39, 82]
		}],
		tooltip: {
			theme: 'dark',
			x: {
				show: false
			},
		}
	}
	var options4 = {
		chart: {
			type: 'bar',
			width: '100%',
			height: 55,
			sparkline: {
				enabled: true
			}
		},
		plotOptions: {
			bar: {
				columnWidth: '50%'
			}
		},
		dataLabels: {
			enabled: false
		},
		fill: {
			type: 'gradient',
			gradient: {
				shade: 'dark',
				gradientToColors: ['#ffe000'],
				shadeIntensity: 1,
				type: 'vertical',
				opacityFrom: 1,
				opacityTo: 1,
				stops: [0, 100, 100, 100]
			},
		},
		colors: ["#fc4a1a"],
		series: [{
			name: 'Sales',
			data: [25, 66, 41, 89, 63, 25, 44, 12, 36, 9, 54]
		}],
		labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
		xaxis: {
			crosshairs: {
				width: 1
			},
		},
		tooltip: {
			theme: 'dark',
			x: {
				show: false
			},
		}
	}
	var options5 = {
		chart: {
			type: 'bar',
			width: '100%',
			height: 55,
			sparkline: {
				enabled: true
			}
		},
		plotOptions: {
			bar: {
				columnWidth: '50%'
			}
		},
		dataLabels: {
			enabled: false
		},
		series: [{
			name: 'Expenses',
			data: [12, 14, 2, 47, 42, 15, 47, 75, 65, 19, 14]
		}],
		fill: {
			type: 'gradient',
			gradient: {
				shade: 'dark',
				gradientToColors: ['#2af598'],
				shadeIntensity: 1,
				type: 'vertical',
				opacityFrom: 1,
				opacityTo: 1,
				stops: [0, 100, 100, 100]
			},
		},
		colors: ["#009efd"],
		labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
		xaxis: {
			crosshairs: {
				width: 1
			},
		},
		tooltip: {
			theme: 'dark',
			x: {
				show: false
			},
		}
	}
	var options6 = {
		chart: {
			type: 'bar',
			width: '100%',
			height: 55,
			sparkline: {
				enabled: true
			}
		},
		plotOptions: {
			bar: {
				columnWidth: '50%'
			}
		},
		fill: {
			type: 'gradient',
			gradient: {
				shade: 'dark',
				gradientToColors: ['#ffe000'],
				shadeIntensity: 1,
				type: 'vertical',
				opacityFrom: 1,
				opacityTo: 1,
				stops: [0, 100, 100, 100]
			},
		},
		colors: ["#799f0c"],
		dataLabels: {
			enabled: false
		},
		series: [{
			name: 'Profits',
			data: [47, 45, 74, 14, 56, 74, 14, 11, 7, 39, 82]
		}],
		labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
		xaxis: {
			crosshairs: {
				width: 1
			},
		},
		tooltip: {
			theme: 'dark',
			x: {
				show: false
			},
		}
	}
	new ApexCharts(document.querySelector("#chart1"), options1).render();
	new ApexCharts(document.querySelector("#chart2"), options2).render();
	new ApexCharts(document.querySelector("#chart3"), options3).render();
	new ApexCharts(document.querySelector("#chart4"), options4).render();
	new ApexCharts(document.querySelector("#chart5"), options5).render();
	new ApexCharts(document.querySelector("#chart6"), options6).render();
	$('#sparklinechart1').sparkline([1, 4, 5, 9, 8, 10, 5, 8, 4, 1, 0, 7, 5, 7, 9, 8, 10, 5], {
		type: 'bar',
		height: '45',
		barWidth: '3',
		resize: true,
		barSpacing: '4',
		barColor: '#14b6ff',
		spotColor: '#14b6ff',
		minSpotColor: '#14b6ff',
		maxSpotColor: '#14b6ff',
		highlightSpotColor: '#14b6ff',
		highlightLineColor: '#14b6ff'
	});
	$("#sparklinechart2").sparkline([1, 1, 0, 1, -1, -1, 1, -1, 0, 0, 1, -1, 1, 1, -1, 0, 0, 1, 1, -1, -1, 1, 1], {
		type: 'tristate',
		height: '30',
		zeroAxis: false
	});
	$("#sparklinechart3").sparkline([28, 48, 40, 19, 96, 27, 100], {
		type: 'line',
		width: '150',
		height: '65',
		lineWidth: '2',
		lineColor: '#04b962',
		fillColor: 'transparent',
		spotColor: '#04b962',
		minSpotColor: '#04b962',
		maxSpotColor: '#04b962',
		highlightSpotColor: '#04b962',
		highlightLineColor: '#04b962'
	});
	$("#sparklinechart4").sparkline([5, 6, 7, 9, 9, 5, 3, 2, 2, 4, 6, 7], {
		type: 'line',
		width: '180',
		height: '65',
		lineWidth: '2',
		lineColor: '#7934f3',
		fillColor: 'rgba(121, 52, 243, 0.33)',
		maxSpotColor: '#7934f3',
		highlightLineColor: '#7934f3',
		highlightSpotColor: '#7934f3'
	});
	$('#sparklinechart5').sparkline([20, 20, 20], {
		type: 'pie',
		height: '200',
		resize: true,
		sliceColors: ['#14b6ff', '#04b962', '#f43643']
	});
	$('#sparklinechart6').sparkline([40, 40, 40], {
		type: 'pie',
		height: '200',
		resize: true,
		sliceColors: ['#7934f3', 'rgba(121, 52, 243, 0.65)', 'rgba(121, 52, 243, 0.45)']
	});
	$("#sparklinechart7").sparkline([15, 16, 20, 18, 19, 14, 17, 12, 11, 12, 10, 14, 17, 14, 10, 15], {
		type: 'bar',
		width: '100%',
		height: '200',
		barWidth: 10,
		barSpacing: 10,
		barColor: '#0a151f'
	});
});