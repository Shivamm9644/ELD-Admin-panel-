import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-horizontal-timeline',
  templateUrl: './horizontal-timeline.component.html',
  styleUrls: ['./horizontal-timeline.component.scss']
})
export class HorizontalTimelineComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    
        // Horizontal timeline js
        $.getScript('./assets/js/horizontal-timeline.js');
  }

}
