import { Component, AfterContentInit } from '@angular/core';
import { PrismService } from '../core/services/prism-service.service';

@Component({
  selector: 'app-select-sample',
  templateUrl: './select-sample.component.html'
})
export class SelectSampleComponent implements AfterContentInit {
  multiple = true;
  unique = true;
  disabled = false;
  placeholder = 'Add new';

  obj = {
    countries: []
  };
  constructor(private prismService: PrismService) { }

  ngAfterContentInit(): void {
    this.prismService.highlightAll();
  }
}
