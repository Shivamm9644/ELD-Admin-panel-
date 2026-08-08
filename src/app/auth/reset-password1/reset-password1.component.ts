import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-reset-password1',
  templateUrl: './reset-password1.component.html',
  styleUrls: ['./reset-password1.component.scss']
})
export class ResetPassword1Component implements OnInit {

  @ViewChild('f') resetpassword1: NgForm;

  constructor(private router: Router,
      private route: ActivatedRoute) { }

  // On submit click, reset form fields
  onSubmit() {
      this.resetpassword1.reset();
  }

  // On Signin1 link click
  onSignin1() {
      this.router.navigate(['signin1'], { relativeTo: this.route.parent });
  }

  ngOnInit() {
  }

}
