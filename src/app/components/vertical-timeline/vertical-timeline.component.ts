import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-vertical-timeline',
  templateUrl: './vertical-timeline.component.html',
  styleUrls: ['./vertical-timeline.component.scss']
})
export class VerticalTimelineComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    // Vertical Timeline JS
    $.getScript('./assets/js/vertical-timeline.js');
}

}
