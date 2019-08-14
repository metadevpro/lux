import { HostListener, Input, Directive, ElementRef } from '@angular/core';

import { TooltipService } from './tooltip.service';
import { PlacementValue } from './placement';
import { LuxTooltipContext } from './tooltip-context';
import { TooltipContentRef } from './tooltop-content';

@Directive({
    selector: '[luxTooltip]'
})
export class LuxTooltipDirective {

    tooltipRef: TooltipContentRef;
    /** Tooltip title */
    @Input('luxTooltip') tooltipTitle: string;

    /** Component or TemplateRef */
    @Input() content: any;

    /** Placement */
    @Input() placement: PlacementValue;

    constructor(private elHost: ElementRef,
                private tooltipService: TooltipService) { }

    @HostListener('mouseenter') onMouseEnter() {
        if (!this.tooltipRef) {
            this.tooltipRef = this.show(this.content, this.elHost, this.placement, { message: this.tooltipTitle });
        }
    }

    @HostListener('mouseleave') onmouseleave() {
        if (this.tooltipRef) {
            this.remove(this.tooltipRef);
            this.tooltipRef = null;
        }
    }

    show(component: any, elHost: ElementRef, placement: PlacementValue, context?: LuxTooltipContext): TooltipContentRef {
        return this.tooltipService.appendComponentToBody(component, elHost, placement, context);
    }

    remove(tooltipRef: TooltipContentRef): void {
        this.tooltipService.removeComponentFromBody(tooltipRef);
    }

}
