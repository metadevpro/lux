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
  valueGeolocation = {
    type: 'Point',
    coordinates: [-5.97, 37.99]
  };

  constructor(private prismService: PrismService) { }

  ngAfterContentInit(): void {
    this.prismService.highlightAll();
  }
}
