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
  placeholder = 'Add new country';

  obj = {
    countries: [ 'Spain', 'Italy', 'Costa Rica', 'Philippines' ]
  };
  constructor(private prismService: PrismService) { }

  ngAfterContentInit(): void {
    this.prismService.highlightAll();
  }
}
