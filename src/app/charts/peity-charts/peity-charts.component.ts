import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-peity-charts',
  templateUrl: './peity-charts.component.html',
  styleUrls: ['./peity-charts.component.scss']
})
export class PeityChartsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    $.getScript('./assets/js/peity-charts.js');
  }

}
