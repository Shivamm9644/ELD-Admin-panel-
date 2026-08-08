import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-signin1',
  templateUrl: './signin1.component.html',
  styleUrls: ['./signin1.component.scss']
})
export class Signin1Component implements OnInit {

  
  @ViewChild('f') signin1: NgForm;

  
  constructor(private router: Router,
              private route: ActivatedRoute) { }


  //  On submit click, reset field value
  onSubmit() {
      this.signin1.reset();
  }
    
  // On ResetPassword link click
  onResetpassword1() {
    this.router.navigate(['reset-password1'], { relativeTo: this.route.parent });
  }

  // On Signup1 link click
  onSignup1() {
    this.router.navigate(['signup1'], { relativeTo: this.route.parent });
  }


  ngOnInit() {
  }

}
