import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  inject
} from '@angular/core';

import { PlacementValue } from './placement';
import { TooltipService } from './tooltip.service';
import { TooltipContentRef } from './tooltop-content';

/**
 * Tooltip directive
 */
@Directive({
  selector: '[luxTooltip]',
  standalone: true,
  providers: [TooltipService]
})
export class LuxTooltipDirective {
  private elHost = inject(ElementRef);
  private tooltipService = inject(TooltipService);

  /** Tooltip title */
  @Input() luxTooltip: any;

  /** Component, TemplateRef or String */
  @Input() content: any;

  /** Placement */
  @Input() placement: PlacementValue;

  tooltipRef: TooltipContentRef;

  @HostListener('mouseenter') onMouseEnter(): void {
    if (!this.tooltipRef) {
      // Use luxTooltip if provided, otherwise use content
      const tooltipContent = this.luxTooltip || this.content;
      if (tooltipContent) {
        this.tooltipRef = this.show(
          tooltipContent,
          this.elHost,
          this.placement
        );
      }
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
