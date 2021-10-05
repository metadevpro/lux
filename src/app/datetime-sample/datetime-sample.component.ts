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
  value1: string = new Date().toISOString();
  value2: string = new Date().toISOString();
  value3: string = new Date().toISOString();
  value4: string = new Date().toISOString();
  value5: string = new Date().toISOString();
  value6: string = new Date().toISOString();

  constructor(private prismService: PrismService) {}

  ngAfterContentInit(): void {
    this.prismService.highlightAll();
  }
}
