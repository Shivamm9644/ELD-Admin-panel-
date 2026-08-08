import { Component, OnInit , ViewChild } from '@angular/core';
import { NgForm } from "@angular/forms";

@Component({
  selector: 'app-lock-screen',
  templateUrl: './lock-screen.component.html',
  styleUrls: ['./lock-screen.component.scss']
})
export class LockScreenComponent implements OnInit {

  @ViewChild('f') lockScreenForm: NgForm;

  onSubmit() {
      this.lockScreenForm.reset();
  }

  constructor() { }

  ngOnInit() {
  }

}
