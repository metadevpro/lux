import { Component, OnInit, AfterContentInit } from '@angular/core';

import { PrismService } from '../core/services/prism-service.service';
@Component({
  selector: 'app-input-sample',
  styleUrls: ['input-sample.component.scss'],
  templateUrl: './input-sample.component.html'
})
export class InputSampleComponent implements OnInit, AfterContentInit {

  value = 'Test';
  value1 = 'Test value';
  name = 'Lux';
  disabled = true;
  readonly = true;

  constructor(private prismService: PrismService) { }
  ngOnInit() {
  }
  ngAfterContentInit(): void {
    this.prismService.highlightAll();
  }
}
