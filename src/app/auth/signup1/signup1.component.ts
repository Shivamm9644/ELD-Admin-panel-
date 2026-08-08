import { Component, OnInit , ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-signup1',
  templateUrl: './signup1.component.html',
  styleUrls: ['./signup1.component.scss']
})
export class Signup1Component implements OnInit {

  
  @ViewChild('f') signup1: NgForm;
  
  constructor(private router: Router,
              private route: ActivatedRoute) { }


  //  On submit click, reset field value
  onSubmit() {
      this.signup1.reset();
  }

  // On Signin link click
  onSignin1() {
    this.router.navigate(['signin1'], { relativeTo: this.route.parent });
  }

  ngOnInit() {
  }

}
