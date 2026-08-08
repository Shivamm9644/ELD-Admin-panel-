import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-other-charts',
  templateUrl: './other-charts.component.html',
  styleUrls: ['./other-charts.component.scss']
})
export class OtherChartsComponent implements OnInit {

  constructor() { }


  ngOnInit() {
    $.getScript('./assets/js/jquery.easy-pie-chart/easy-pie-chart.init.js');

  }

}
