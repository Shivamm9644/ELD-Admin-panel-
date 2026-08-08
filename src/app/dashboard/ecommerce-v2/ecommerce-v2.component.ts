import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ecommerce-v2',
  templateUrl: './ecommerce-v2.component.html',
  styleUrls: ['./ecommerce-v2.component.scss']
})
export class EcommerceV2Component implements OnInit {

  constructor() { }

  ngOnInit() {
    $.getScript('./assets/js/dashboard-eCommerce-v2.js');

  }

}
