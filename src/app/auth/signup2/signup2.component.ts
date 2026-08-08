import { Component, OnInit , ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-signup2',
  templateUrl: './signup2.component.html',
  styleUrls: ['./signup2.component.scss']
})
export class Signup2Component implements OnInit {

  
  @ViewChild('f') signup2: NgForm;
  
  constructor(private router: Router,
              private route: ActivatedRoute) { }


  //  On submit click, reset field value
  onSubmit() {
      this.signup2.reset();
  }

  // On Signin link click
  onSignin2() {
    this.router.navigate(['signin2'], { relativeTo: this.route.parent });
  }
  ngOnInit() {
  }

}
