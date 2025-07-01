import { AfterContentInit, Component, inject } from '@angular/core';
import { PrismService } from '../core/services/prism-service.service';
import { TooltipComponent } from './tooltip';

@Component({
  standalone: false,
  selector: 'app-tooltip-sample',
  templateUrl: './tooltip-sample.component.html'
})
export class TooltipSampleComponent implements AfterContentInit {
  private prismService = inject(PrismService);

  ngAfterContentInit(): void {
    this.prismService.highlightAll();
  }

  getComponentTooltip(): TooltipComponent {
    return TooltipComponent;
  }
}
