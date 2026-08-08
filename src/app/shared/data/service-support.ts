
//line -chart 2

export var lineChartData: Array<any> = [

    { data: [10, 40, 20, 40, 40, 60, 40, 80, 40, 70, 40, 70], label: 'Request Volume' },
    { data: [30, 60, 50, 60, 60, 80, 60, 120, 60, 100, 60, 100], label: 'Service Level' },
  
  ];
  export var lineChartLabels: Array<any> = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  export var lineChartOptions: any = {
    animation: {
      duration: 1000, // general animation time
      easing: 'easeOutBack'
    },
    hover: {
      animationDuration: 1000, // duration of animations when hovering an item
      mode: 'label'
    },
    responsiveAnimationDuration: 1000, // animation duration after a resize
    responsive: true,
    maintainAspectRatio: false,
    legend: {
        display: true,
        labels: {
          fontColor: '#585757',  
          boxWidth:40
        }
      },
      tooltips: {
        displayColors:false
      },
    scales: {
      xAxes: [{
        ticks: {
            beginAtZero:true,
            fontColor: '#585757'
        },
        gridLines: {
          display: true ,
          color: "rgba(0, 0, 0, 0.05)"
        },
      }],
      yAxes: [{
        ticks: {
            beginAtZero:true,
            fontColor: '#585757'
        },
        gridLines: {
          display: true ,
          color: "rgba(0, 0, 0, 0.05)"
        },
      }]
    },
  };
  export var lineChartColors: Array<any> = [
  
    {
  
        fill: true,
        backgroundColor: '#02ba5a',
        borderColor: "transparent",
        pointRadius :"0",
        lineTension :'0',
        borderWidth: 3
    },
    
    {
  
        fill: true,
        backgroundColor: "rgba(2, 186, 90, 0.52)",
        borderColor: "transparent",
        pointRadius :"0",
        lineTension :'0',
        borderWidth: 1
      },
   
  
  ];
  export var lineChartLegend = true;
  export var lineChartType = 'line';