import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-reset-password2',
  templateUrl: './reset-password2.component.html',
  styleUrls: ['./reset-password2.component.scss']
})
export class ResetPassword2Component implements OnInit {

  @ViewChild('f') resetpassword2: NgForm;

  constructor(private router: Router,
      private route: ActivatedRoute) { }

  // On submit click, reset form fields
  onSubmit() {
      this.resetpassword2.reset();
  }

  // On Signin2 link click
  onSignin2() {
      this.router.navigate(['signin2'], { relativeTo: this.route.parent });
  }


  ngOnInit() {
  }

}
