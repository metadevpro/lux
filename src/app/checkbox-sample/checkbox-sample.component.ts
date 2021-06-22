import { Component, AfterContentInit } from '@angular/core';
import { PrismService } from '../core/services/prism-service.service';

@Component({
  selector: 'app-checkbox-sample',
  templateUrl: './checkbox-sample.component.html'
})
export class CheckboxSampleComponent implements AfterContentInit {
  model = {
    hasCar: true,
    closed: false
  };

  constructor(private prismService: PrismService) { }

  ngAfterContentInit(): void {
    this.prismService.highlightAll();
  }
}
