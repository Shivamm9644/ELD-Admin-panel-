import { Component } from '@angular/core';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import emailMask from 'text-mask-addons/dist/emailMask';
import createAutoCorrectedDatePipe from 'text-mask-addons/dist/createAutoCorrectedDatePipe';
import { FormControl } from '@angular/forms';

import { placeholderChars, alphabetic, digit } from './constants';

const defaultValues = {
  placeholderChar: placeholderChars.whitespace,
  guide: true,
  pipe: null,
  keepCharPositions: false,
  help: null,
  placeholder: null
};

@Component({
  selector: 'app-masks',
  templateUrl: './masks.component.html',
  styleUrls: ['./masks.component.scss']
})
export class MasksComponent {

  myModel: string;
  modelWithValue: string;
  formControlInput: FormControl = new FormControl();
  mask: Array<string | RegExp>;

  choices = [{
    name: 'US Phone Number',
    mask: ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
    placeholder: '(123) 456-7890'
  }, {
    name: 'US Phone Mumber With Country Code',
    mask: ['+', '1', ' ', '(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
    placeholder: '+1 (123) 456-7890'
  }, {
    name: 'Date',
    mask: [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/],
    placeholder: '31/12/2019'
  }, {
    name: 'Date (Auto-Corrected)',
    mask: [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/],
    pipe: createAutoCorrectedDatePipe(),
    placeholder: 'Please enter a date',
  }, {
    name: 'US Dollar Amount',
    mask: createNumberMask(),
    placeholder: 'Enter an amount',
  }, {
    name: 'US Dollar Amount (allows decimal)',
    mask: createNumberMask({allowDecimal: true}),
    placeholder: 'Enter an amount',
  }, {
    name: 'Percentage Amount',
    mask: createNumberMask({suffix: '%', prefix: ''}),
    placeholder: 'Enter an amount',
  }, {
    name: 'Email',
    mask: emailMask,
    placeholder: 'example@domain.com',
  }, {
    name: 'US Zip Code',
    mask: [/[1-9]/, /\d/, /\d/, /\d/, /\d/],
    placeholder: '85457',
  }, {
    name: 'Canadian Postal Code',
    mask: [alphabetic, digit, alphabetic, ' ', digit, alphabetic, digit],
    pipe: (conformedValue) => ({value: conformedValue.toUpperCase()}),
    placeholder: 'K9B 5C2'
  }];

  constructor() {
    this.mask = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
    this.myModel = '';
    this.modelWithValue = '1234567890';
    this.formControlInput.setValue('1234567899');
  }
}
