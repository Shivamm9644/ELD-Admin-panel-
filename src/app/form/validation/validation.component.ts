import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators, NgForm } from '@angular/forms';


@Component({
  selector: 'app-validation',
  templateUrl: './validation.component.html',
  styleUrls: ['./validation.component.scss']
})
export class ValidationComponent implements OnInit {

  @ViewChild('f') floatingLabelForm: NgForm;
  @ViewChild('vform') validationForm: FormGroup;
  regularForm: FormGroup;

  
  constructor() { }


  ngOnInit() {
      this.regularForm = new FormGroup({
          'inputEmail': new FormControl(null, [Validators.required, Validators.email]),
          'password': new FormControl(null, [Validators.required, Validators.minLength(4), Validators.maxLength(24)]),
          'passwordConfirm': new FormControl(null, [Validators.required]),
          'textArea': new FormControl(null, [Validators.required]),
          'radioOption': new FormControl('Option one is this')
      }, {updateOn: 'blur'});
  }

  onReactiveFormSubmit() {
      this.regularForm.reset();
  }
  onTemplateFormSubmit() {
      this.floatingLabelForm.reset();
  }
  onCustomFormSubmit() {
      this.validationForm.reset();
  }

}
