import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sparkline-charts',
  templateUrl: './sparkline-charts.component.html',
  styleUrls: ['./sparkline-charts.component.scss']
})
export class SparklineChartsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    $.getScript('./assets/js/sparkline-charts.js');
  }

}
