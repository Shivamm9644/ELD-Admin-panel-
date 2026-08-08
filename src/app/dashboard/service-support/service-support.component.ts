import { Component, OnInit } from '@angular/core';
import * as chartsData from '../../shared/data/service-support';


@Component({
  selector: 'app-service-support',
  templateUrl: './service-support.component.html',
  styleUrls: ['./service-support.component.scss']
})
export class ServiceSupportComponent implements OnInit {

  
  // lineChart -Chart 2
  public lineChartData = chartsData.lineChartData;
  public lineChartLabels = chartsData.lineChartLabels;
  public lineChartOptions = chartsData.lineChartOptions;
  public lineChartColors = chartsData.lineChartColors;
  public lineChartLegend = chartsData.lineChartLegend;
  public lineChartType = chartsData.lineChartType;

  
  
  // events
  public chartClicked(e: any): void {
    //your code here
  }

  public chartHovered(e: any): void {
    //your code here
  }
  

  constructor() { }

  ngOnInit() {
    $.getScript('./assets/js/dashboard-service-support.js');

  }

}
