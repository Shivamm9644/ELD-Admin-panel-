// chart 1
	
$('.fleet-chart').easyPieChart({
    easing: 'easeOutBounce',
    barColor : '#ffffff',
    lineWidth: 10,
    trackColor : 'rgba(255, 255, 255, 0.12)',
    scaleColor: false,
    onStep: function(from, to, percent) {
        $(this.el).find('.fleet-status-percent').text(Math.round(percent));
    }
 });



 
    // chart 6

    var ctx = document.getElementById("timeChart").getContext('2d');


    var gradientStroke3 = ctx.createLinearGradient(0, 0, 0, 300);
    gradientStroke3.addColorStop(0, '#42e695');
    gradientStroke3.addColorStop(1, '#3bb2b8');

    var gradientStroke4 = ctx.createLinearGradient(0, 0, 0, 300);
    gradientStroke4.addColorStop(0, ' #7f00ff');
    gradientStroke4.addColorStop(0.5, '#e100ff');

          var myChart = new Chart(ctx, {
              type: 'bar',
              data: {
                  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                  datasets: [{
                      label: 'Route',
                      data: [15, 8, 12, 5, 12, 8, 16, 25, 15, 10, 20, 10],
                      backgroundColor: gradientStroke3,
          hoverBackgroundColor: gradientStroke3
                  }, {
                      label: 'Time',
                      data: [25, 18, 22, 15, 22, 18, 26, 35, 25, 20, 30, 20],
                      backgroundColor: gradientStroke4,
          hoverBackgroundColor: gradientStroke4,
                  }]
              },
          options: {
              maintainAspectRatio: false,
              legend: {
                display: true,
                labels: {
                  fontColor: '#585757',  
                  boxWidth:40
                }
              },
              tooltips: {
                enabled:true,
        displayColors:false
              },	
            scales: {
                xAxes: [{
                      categoryPercentage: 0.3,
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
               }

           }
          });




