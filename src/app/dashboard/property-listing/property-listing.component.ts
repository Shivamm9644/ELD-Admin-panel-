import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-property-listing',
  templateUrl: './property-listing.component.html',
  styleUrls: ['./property-listing.component.scss']
})
export class PropertyListingComponent implements OnInit {

  
  
  // events
  public chartClicked(e: any): void {
    //your code here
  }

  public chartHovered(e: any): void {
    //your code here
  }


  constructor() { }

  ngOnInit() {
    $.getScript('./assets/js/dashboard-property-listing.js');
    
  }

}
