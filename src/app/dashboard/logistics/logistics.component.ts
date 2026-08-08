import { Component, OnInit } from '@angular/core';
import * as chartsData from '../../shared/data/logistics';


@Component({
  selector: 'app-logistics',
  templateUrl: './logistics.component.html',
  styleUrls: ['./logistics.component.scss']
})
export class LogisticsComponent implements OnInit {


  
  // Doughnut -Chart 1
  public doughnutChartLabels = chartsData.doughnutChartLabels;
  public doughnutChartData = chartsData.doughnutChartData;
  public doughnutChartType = chartsData.doughnutChartType;
  public doughnutChartColors = chartsData.doughnutChartColors;
  public doughnutChartOptions = chartsData.doughnutChartOptions;

  
  // Pie -chart 2
  public pieChartLabels = chartsData.pieChartLabels;
  public pieChartData = chartsData.pieChartData;
  public pieChartType = chartsData.pieChartType;
  public pieChartColors = chartsData.pieChartColors;
  public pieChartOptions = chartsData.pieChartOptions;

  
  // lineChart -Chart 3
  public lineChartData = chartsData.lineChartData;
  public lineChartLabels = chartsData.lineChartLabels;
  public lineChartOptions = chartsData.lineChartOptions;
  public lineChartColors = chartsData.lineChartColors;
  public lineChartLegend = chartsData.lineChartLegend;
  public lineChartType = chartsData.lineChartType;


  
 // lineChart -Chart 4
 public lineChart2Data = chartsData.lineChart2Data;
 public lineChart2Labels = chartsData.lineChart2Labels;
 public lineChart2Options = chartsData.lineChart2Options;
 public lineChart2Colors = chartsData.lineChart2Colors;
 public lineChart2Legend = chartsData.lineChart2Legend;
 public lineChart2Type = chartsData.lineChart2Type;

  
  // lineChart -Chart 5
  public lineChart3Data = chartsData.lineChart3Data;
  public lineChart3Labels = chartsData.lineChart3Labels;
  public lineChart3Options = chartsData.lineChart3Options;
  public lineChart3Colors = chartsData.lineChart3Colors;
  public lineChart3Legend = chartsData.lineChart3Legend;
  public lineChart3Type = chartsData.lineChart3Type;

  
  // events
  public chartClicked(e: any): void {
    //your code here
  }

  public chartHovered(e: any): void {
    //your code here
  }


  constructor() { }

  ngOnInit() {
    $.getScript('./assets/js/dashboard-logistics.js');  
  }

}
