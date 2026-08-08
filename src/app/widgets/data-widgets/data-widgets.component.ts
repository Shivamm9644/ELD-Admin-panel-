import { Component, OnInit } from '@angular/core';
import * as chartsData from '../../shared/data/widgets-data';


@Component({
  selector: 'app-data-widgets',
  templateUrl: './data-widgets.component.html',
  styleUrls: ['./data-widgets.component.scss']
})
export class DataWidgetsComponent implements OnInit {

  
  // Data-weidgets-Chart 1
  public dwChart1Data = chartsData.dwChart1Data;
  public dwChart1Labels = chartsData.dwChart1Labels;
  public dwChart1Options = chartsData.dwChart1Options;
  public dwChart1Colors = chartsData.dwChart1Colors;
  public dwChart1Legend = chartsData.dwChart1Legend;
  public dwChart1Type = chartsData.dwChart1Type;

  
  // Data-weidgets-Chart 2
  public dwChart2Data = chartsData.dwChart2Data;
  public dwChart2Labels = chartsData.dwChart2Labels;
  public dwChart2Options = chartsData.dwChart2Options;
  public dwChart2Colors = chartsData.dwChart2Colors;
  public dwChart2Legend = chartsData.dwChart2Legend;
  public dwChart2Type = chartsData.dwChart2Type;



  
  // Data-weidgets-Chart 4
  public dwChart4Data = chartsData.dwChart4Data;
  public dwChart4Labels = chartsData.dwChart4Labels;
  public dwChart4Options = chartsData.dwChart4Options;
  public dwChart4Colors = chartsData.dwChart4Colors;
  public dwChart4Legend = chartsData.dwChart4Legend;
  public dwChart4Type = chartsData.dwChart4Type;


  
  // Data-weidgets-Chart 12
  public dwChart12Data = chartsData.dwChart12Data;
  public dwChart12Labels = chartsData.dwChart12Labels;
  public dwChart12Options = chartsData.dwChart12Options;
  public dwChart12Colors = chartsData.dwChart12Colors;
  public dwChart12Legend = chartsData.dwChart12Legend;
  public dwChart12Type = chartsData.dwChart12Type;


  
  // Data-weidgets-Chart 13
  public dwChart13Data = chartsData.dwChart13Data;
  public dwChart13Labels = chartsData.dwChart13Labels;
  public dwChart13Options = chartsData.dwChart13Options;
  public dwChart13Colors = chartsData.dwChart13Colors;
  public dwChart13Legend = chartsData.dwChart13Legend;
  public dwChart13Type = chartsData.dwChart13Type;

  
  // Data-weidgets-Chart 14
  public dwChart14Data = chartsData.dwChart14Data;
  public dwChart14Labels = chartsData.dwChart14Labels;
  public dwChart14Options = chartsData.dwChart14Options;
  public dwChart14Colors = chartsData.dwChart14Colors;
  public dwChart14Legend = chartsData.dwChart14Legend;
  public dwChart14Type = chartsData.dwChart14Type;


  
  // Data-weidgets-Chart 15
  public dwChart15Data = chartsData.dwChart15Data;
  public dwChart15Labels = chartsData.dwChart15Labels;
  public dwChart15Options = chartsData.dwChart15Options;
  public dwChart15Colors = chartsData.dwChart15Colors;
  public dwChart15Legend = chartsData.dwChart15Legend;
  public dwChart15Type = chartsData.dwChart15Type;

  

  // events
  public chartClicked(e: any): void {
    //your code here
  }

  public chartHovered(e: any): void {
    //your code here
  }

  constructor() { }

  ngOnInit() {
    $.getScript('./assets/js/data-widgets.js');

  }

}