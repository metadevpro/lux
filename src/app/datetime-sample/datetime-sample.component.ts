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
  value1: string = new Date().toISOString().slice(0, 19) + 'Z';
  value2: string = new Date().toISOString().slice(0, 19) + 'Z';
  value3: string = new Date().toISOString().slice(0, 19) + 'Z';
  value4: string = new Date().toISOString().slice(0, 19) + 'Z';
  value5: string = new Date().toISOString().slice(0, 16) + 'Z';
  value6: string = new Date().toISOString().slice(0, 19) + 'Z';

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
