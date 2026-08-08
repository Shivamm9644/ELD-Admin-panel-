import { Component, OnInit } from '@angular/core';
import * as chartsData from '../../shared/data/dashboard-eCommerce-v1';


@Component({
  selector: 'app-ecommerce-v1',
  templateUrl: './ecommerce-v1.component.html',
  styleUrls: ['./ecommerce-v1.component.scss']
})
export class EcommerceV1Component implements OnInit {

  
  // line -Chart 1
  public lineChartData = chartsData.lineChartData;
  public lineChartLabels = chartsData.lineChartLabels;
  public lineChartOptions = chartsData.lineChartOptions;
  public lineChartColors = chartsData.lineChartColors;
  public lineChartLegend = chartsData.lineChartLegend;
  public lineChartType = chartsData.lineChartType;

  
  // Doughnut -Chart 2
  public doughnutChartLabels = chartsData.doughnutChartLabels;
  public doughnutChartData = chartsData.doughnutChartData;
  public doughnutChartType = chartsData.doughnutChartType;
  public doughnutChartColors = chartsData.doughnutChartColors;
  public doughnutChartOptions = chartsData.doughnutChartOptions;

  
  // line -Chart 3
  public lineChart3Data = chartsData.lineChart3Data;
  public lineChart3Labels = chartsData.lineChart3Labels;
  public lineChart3Options = chartsData.lineChart3Options;
  public lineChart3Colors = chartsData.lineChart3Colors;
  public lineChart3Legend = chartsData.lineChart3Legend;
  public lineChart3Type = chartsData.lineChart3Type;

  // bar -Chart 4
  public barChartOptions = chartsData.barChartOptions;
  public barChartLabels = chartsData.barChartLabels;
  public barChartType = chartsData.barChartType;
  public barChartLegend = chartsData.barChartLegend;
  public barChartData = chartsData.barChartData;
  public barChartColors = chartsData.barChartColors;

  // bar -Chart 5
  public barChart5Options = chartsData.barChart5Options;
  public barChart5Labels = chartsData.barChart5Labels;
  public barChart5Type = chartsData.barChart5Type;
  public barChart5Legend = chartsData.barChart5Legend;
  public barChart5Data = chartsData.barChart5Data;
  public barChart5Colors = chartsData.barChart5Colors;


  
  // events
  public chartClicked(e: any): void {
    //your code here
  }

  public chartHovered(e: any): void {
    //your code here
  }

  constructor() { }

  ngOnInit() {

    $.getScript('./assets/js/dashboard-eCommerce-v1.js');

  }

}
