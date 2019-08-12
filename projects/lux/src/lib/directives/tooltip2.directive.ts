import { HostListener, Input, Directive, ComponentRef, ElementRef } from '@angular/core';

import { TooltipComponent } from './tooltip.component';
import { TooltipService } from './tooltip.service';
import { PlacementValue } from './placement';
import { LuxTooltipContext } from './tooltip-context';

@Directive({
    selector: '[luxTooltipDirective]'
})
export class LuxTooltipDirective {

    tooltipComponentRef: ComponentRef<any>;
    /** Tooltip title */
    @Input('luxTooltipDirective') tooltipTitle: string;

    /** Component or TemplateRef */
    @Input() content: any;

    /** Placement */
    @Input() placement: PlacementValue;

    constructor(private elHost: ElementRef,
                private tooltipService: TooltipService) { }

    @HostListener('mouseenter') onMouseEnter() {
        if (!this.tooltipComponentRef) {
            this.tooltipComponentRef = this.content ? this.show(this.content, this.elHost, this.placement) :
                                                 this.show(TooltipComponent, this.elHost, this.placement, { message: this.tooltipTitle });
        }
    }

    @HostListener('mouseleave') onmouseleave() {
        if (this.tooltipComponentRef) {
            this.remove();
            this.tooltipComponentRef = null;
        }
    }

    show(component: any, elHost: ElementRef, placement: PlacementValue, context?: LuxTooltipContext): ComponentRef<any> {
        return this.tooltipService.appendComponentToBody(component, elHost, placement, context);
    }

    remove(): void {
        this.tooltipService.removeComponentFromBody();
    }

}
