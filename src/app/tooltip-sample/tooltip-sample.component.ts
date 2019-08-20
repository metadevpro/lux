import { Component, AfterContentInit } from '@angular/core';
import { PrismService } from '../core/services/prism-service.service';
import { TooltipComponent } from './tooltip';

@Component({
  selector: 'app-tooltip-sample',
  templateUrl: './tooltip-sample.component.html'
})
export class TooltipSampleComponent implements AfterContentInit {

  constructor(private prismService: PrismService) { }

  ngAfterContentInit(): void {
    this.prismService.highlightAll();
  }

  getComponentTooltip(): TooltipComponent {
    return TooltipComponent;
  }
}
