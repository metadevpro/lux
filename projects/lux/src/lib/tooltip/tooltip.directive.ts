import { HostListener, Input, Directive, ElementRef } from '@angular/core';

import { TooltipService } from './tooltip.service';
import { PlacementValue } from './placement';
import { TooltipContentRef } from './tooltop-content';

/**
 * Tooltip directive
 */
@Directive({
  selector: '[luxTooltip]'
})
export class LuxTooltipDirective {
  /** Tooltip title */
  @Input() luxTooltip: any;

  /** Component, TemplateRef or String */
  @Input() content: any;

  /** Placement */
  @Input() placement: PlacementValue;

  tooltipRef: TooltipContentRef;

  constructor(
    private elHost: ElementRef,
    private tooltipService: TooltipService
  ) {}

  @HostListener('mouseenter') onMouseEnter(): void {
    if (!this.tooltipRef) {
      this.tooltipRef = this.show(this.content, this.elHost, this.placement);
    }
  }

  @HostListener('mouseleave') onMouseLeave(): void {
    if (this.tooltipRef) {
      this.remove(this.tooltipRef);
      this.tooltipRef = null;
    }
  }

  @HostListener('click') onClick(): void {
    if (this.tooltipRef) {
      this.remove(this.tooltipRef);
      this.tooltipRef = null;
    }
  }

  show(
    component: any,
    elHost: ElementRef,
    placement: PlacementValue
  ): TooltipContentRef {
    return this.tooltipService.appendComponentToBody(
      component,
      elHost,
      placement
    );
  }

  remove(tooltipRef: TooltipContentRef): void {
    this.tooltipService.removeComponentFromBody(tooltipRef);
  }
}
