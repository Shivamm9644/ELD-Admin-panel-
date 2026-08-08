
// Doughnut -chart 1
export var doughnutChartLabels: string[] = ["Within Time Limit", "Out of Time Limit"];
export var doughnutChartData: number[] = [325, 145];
export var doughnutChartColors: any[] = [{ backgroundColor: [ "#fba540", "#03d0ea" ]
,borderWidth: [0, 0,]}];
export var doughnutChartType = 'doughnut';
export var doughnutChartOptions: any = {
  responsive: true,
  maintainAspectRatio: false,
  //cutoutPercentage: 80,
  legend: {
    position :"bottom",	
    display: false,
       labels: {
         fontColor: '#585757',  
         boxWidth:15
      }
   }
   ,
   tooltips: {
     displayColors:false
   }
   
};


// Pie -Chart 2
export var pieChartLabels: string[] = ["Germany", "France", "Switzerland", "Australia"];
export var pieChartData: number[] = [55, 220, 40, 40];
export var pieChartType = 'pie';
export var pieChartColors: any[] = [{ backgroundColor: ["#14abef", "#02ba5a", "#d13adf", "#fba540"], borderWidth: [0, 0, 0, 0] }];
export var pieChartOptions: any = {
  responsive: true,
  maintainAspectRatio: false,
  legend: {
    position :"bottom",	
    display: true,
       labels: {
         fontColor: '#585757',  
         boxWidth:10
      }
   }
  
};


//line -chart 3

export var lineChartData: Array<any> = [

    { data: [10, 18, 12, 8, 15, 10], label: 'Total Revenue' },
  
  ];
  export var lineChartLabels: Array<any> = ['01', '02', '03', '04', '05', '06'];
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
        display: false,
        labels: {
        fontColor: '#ddd',  
        boxWidth:40
        },
        tooltips: {
            enabled: false
       },
      },
    scales: {
      xAxes: [{
            display: false,
            gridLines: false
          }],
      yAxes: [{
            display: false,
            gridLines: false
          }]
    },
  };
  export var lineChartColors: Array<any> = [
  
    {
  
      fill: true,
      backgroundColor: 'rgba(255, 255, 255, 0.12)',
            borderColor: '#fff',
            pointBackgroundColor:'#fff',
            pointHoverBackgroundColor:'#fff',
            pointBorderColor :'#fff',
            pointHoverBorderColor :'#fff',
            pointBorderWidth :1,
            pointRadius :0,
            pointHoverRadius :4,
            borderWidth: 2
    },
   
  
  ];
  export var lineChartLegend = true;
  export var lineChartType = 'line';



  //line -chart 4

export var lineChart2Data: Array<any> = [

    { data: [10, 18, 12, 8, 15, 10], label: 'Total Revenue' },
  
  ];
  export var lineChart2Labels: Array<any> = ['01', '02', '03', '04', '05', '06'];
  export var lineChart2Options: any = {
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
        display: false,
        labels: {
        fontColor: '#ddd',  
        boxWidth:40
        },
        tooltips: {
            enabled: false
       },
      },
    scales: {
      xAxes: [{
            display: false,
            gridLines: false
          }],
      yAxes: [{
            display: false,
            gridLines: false
          }]
    },
  };
  export var lineChart2Colors: Array<any> = [
  
    {
  
      fill: true,
      backgroundColor: 'rgba(255, 255, 255, 0.12)',
            borderColor: '#fff',
            pointBackgroundColor:'#fff',
            pointHoverBackgroundColor:'#fff',
            pointBorderColor :'#fff',
            pointHoverBorderColor :'#fff',
            pointBorderWidth :1,
            pointRadius :0,
            pointHoverRadius :4,
            borderWidth: 2
    },
   
  
  ];
  export var lineChart2Legend = true;
  export var lineChart2Type = 'line';





  //line -chart 5

  export var lineChart3Data: Array<any> = [

    { data: [10, 18, 12, 8, 15, 10], label: 'Total Revenue' },
  
  ];
  export var lineChart3Labels: Array<any> = ['01', '02', '03', '04', '05', '06'];
  export var lineChart3Options: any = {
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
        display: false,
        labels: {
        fontColor: '#ddd',  
        boxWidth:40
        },
        tooltips: {
            enabled: false
       },
      },
    scales: {
      xAxes: [{
            display: false,
            gridLines: false
          }],
      yAxes: [{
            display: false,
            gridLines: false
          }]
    },
  };
  export var lineChart3Colors: Array<any> = [
  
    {
  
      fill: true,
      backgroundColor: 'rgba(255, 255, 255, 0.12)',
        borderColor: '#fff',
        pointBackgroundColor:'#fff',
        pointHoverBackgroundColor:'#fff',
        pointBorderColor :'#fff',
        pointHoverBorderColor :'#fff',
        pointBorderWidth :1,
        pointRadius :0,
        pointHoverRadius :4,
        borderWidth: 2
    },
   
  
  ];
  export var lineChart3Legend = true;
  export var lineChart3Type = 'line';
  
