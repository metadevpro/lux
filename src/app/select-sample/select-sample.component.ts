import { AfterContentInit, Component, inject } from '@angular/core';
import { PrismService } from '../core/services/prism-service.service';

@Component({
  standalone: false,
  selector: 'app-select-sample',
  templateUrl: './select-sample.component.html'
})
export class SelectSampleComponent implements AfterContentInit {
  private prismService = inject(PrismService);

  multiple = true;
  unique = true;
  disabled = false;
  placeholder = 'Add new country';

  obj = {
    countries: ['Spain', 'Italy', 'Costa Rica', 'Philippines']
  };

  ngAfterContentInit(): void {
    this.prismService.highlightAll();
  }
}
