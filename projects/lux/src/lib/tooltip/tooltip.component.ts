import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { LuxTooltipContext } from './tooltip-context';

/**
 * Default Tooltip Component
 */
@Component({
  selector: 'lux-tooltip',
  imports: [CommonModule],
  template: `
    <span class="lux-tooltip" style="transition: opacity 200ms">{{
      context.message
    }}</span>
  `
})
export class TooltipComponent {
  @Input() context: LuxTooltipContext;

  constructor() {}
}
