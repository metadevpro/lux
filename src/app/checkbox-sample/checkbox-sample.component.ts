import { AfterContentInit, Component, inject } from '@angular/core';
import { PrismService } from '../core/services/prism-service.service';

@Component({
  standalone: false,

  selector: 'app-checkbox-sample',
  templateUrl: './checkbox-sample.component.html'
})
export class CheckboxSampleComponent implements AfterContentInit {
  private prismService = inject(PrismService);

  model = {
    hasCar: true,
    closed: false
  };

  ngAfterContentInit(): void {
    this.prismService.highlightAll();
  }
}
