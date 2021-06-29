import { Component, AfterContentInit } from '@angular/core';

import { PrismService } from '../core/services/prism-service.service';
@Component({
  selector: 'app-input-sample',
  styleUrls: ['input-sample.component.scss'],
  templateUrl: './input-sample.component.html'
})
export class InputSampleComponent implements AfterContentInit {
  value = 'Test';
  value1 = 'Test value';
  name = 'Lux';
  disabled = true;
  readonly = true;
  valueEmail: string = null;
  valueDate: string = null;
  valueTime: string = null;
  valuePassword = '';
  valueNumber = 7;
  valueCurrencyUsd = 97.01;
  valueCurrencyEur = 123.45;
  valuePercentage = 75.24;
  valuePermillage = 923.34;

  f1 = {
    type: 'email',
    required: true,
    disabled: false,
    inlineErrors: false,
    value: 'a',
    formValues: {
      field1: null // 'initial@value.com'
    }
  };

  constructor(private prismService: PrismService) {}

  ngAfterContentInit(): void {
    this.prismService.highlightAll();
  }

  setEmpty(): void {
    this.f1.formValues.field1 = '';
  }
}
