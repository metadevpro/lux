import { Component, AfterContentInit } from '@angular/core';

import { PrismService } from '../core/services/prism-service.service';
import { toString } from './toString.pipe';
@Component({
  selector: 'app-datetime-sample',
  styleUrls: ['datetime-sample.component.scss'],
  templateUrl: './datetime-sample.component.html'
})
export class DatetimeSampleComponent implements AfterContentInit {
  name = 'Lux';
  disabled = true;
  readonly = true;
  value1: string = new Date().toISOString();
  value2: string = new Date().toISOString();
  value3: string = new Date().toISOString();
  value4: string = new Date().toISOString();
  value5: string = new Date().toISOString().slice(0, 17) + '00.000Z';

  sandboxForm = {
    min: '1900-01-01T00:00:00Z',
    max: '2100-01-01T00:00:00Z',
    includeSeconds: true,
    required: true,
    disabled: false,
    inlineErrors: false,
    formValues: {
      field1: null // 'initial@value.com'
    }
  };

  constructor(private prismService: PrismService) {}

  ngAfterContentInit(): void {
    this.prismService.highlightAll();
  }
}
