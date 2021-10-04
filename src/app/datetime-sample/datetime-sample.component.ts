import { Component, AfterContentInit } from '@angular/core';

import { PrismService } from '../core/services/prism-service.service';
@Component({
  selector: 'app-datetime-sample',
  styleUrls: ['datetime-sample.component.scss'],
  templateUrl: './datetime-sample.component.html'
})
export class DatetimeSampleComponent implements AfterContentInit {
  name = 'Lux';
  disabled = true;
  readonly = true;
  value1: string = '2001-01-01T01:01:01';
  value2: string = '2001-01-01T01:01:01';
  value3: string = '2001-01-01T01:01:01';
  value4: string = '2001-01-01T01:01:01';
  value5: string = '2001-01-01T01:01:01';

  constructor(private prismService: PrismService) {}

  ngAfterContentInit(): void {
    this.prismService.highlightAll();
  }
}
