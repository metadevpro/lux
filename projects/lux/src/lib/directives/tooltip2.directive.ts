import { HostListener, Input, Directive, ComponentRef, ElementRef } from '@angular/core';

import { TooltipComponent } from './tooltip.component';
import { TooltipService } from './tooltip.service';
import { PlacementValue } from './placement';

@Directive({
    selector: '[luxTooltipDirective]'
})
export class LuxTooltipDirective {

    tooltipComponentRef: ComponentRef<any>;
    /** Tooltip title */
    @Input('luxTooltipDirective') tooltipTitle: string;

    /** Placement */
    @Input() placement: PlacementValue;

    constructor(private elHost: ElementRef,
                private tooltipService: TooltipService) { }

    @HostListener('mouseenter') onMouseEnter() {
        if (!this.tooltipComponentRef) {
            this.tooltipComponentRef = this.show(TooltipComponent, this.elHost, this.placement);
        }
    }

    @HostListener('mouseleave') onmouseleave() {
        if (this.tooltipComponentRef) {
            this.remove();
            this.tooltipComponentRef = null;
        }
    }

    show(component: any, elHost: ElementRef, placement: PlacementValue): ComponentRef<any> {
        return this.tooltipService.appendComponentToBody(component, elHost, placement);
    }

    remove(): void {
        this.tooltipService.removeComponentFromBody();
    }

}
