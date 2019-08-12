import { Injectable, Injector, ComponentRef, ComponentFactoryResolver, ApplicationRef, EmbeddedViewRef, ElementRef } from '@angular/core';

import { PlacementValue, Placement } from './placement';
import { LuxTooltipContext } from './tooltip-context';
import { TooltipComponent } from './tooltip.component';

@Injectable()
export class TooltipService {

    private componentRef: ComponentRef<any>;

    constructor(private _injector: Injector,
                private _crf: ComponentFactoryResolver,
                private _applicationRef: ApplicationRef) { }

    appendComponentToBody(component: any, elHost: ElementRef, placement: PlacementValue, context?: LuxTooltipContext) {
        this.componentRef = this._crf.resolveComponentFactory(component)
                            .create(this._injector);
        this.componentRef.instance.context = context;
        this._applicationRef.attachView(this.componentRef.hostView);
        let domElem = (this.componentRef.hostView as EmbeddedViewRef<any>)
                        .rootNodes[0];
        document.body.appendChild(domElem);
        domElem = this.setStyle(domElem, placement);
        domElem = this.setPosition(domElem, elHost, placement);
        return this.componentRef;
    }

    removeComponentFromBody() {
        this._applicationRef.detachView(this.componentRef.hostView);
        this.componentRef.destroy();
    }

    private setStyle(domElem: HTMLElement, placement: PlacementValue): HTMLElement {
        domElem.style.position = 'absolute';
        domElem.style.minWidth = 'min-content';
        domElem.style.minHeight = 'min-content';
        const tooltipElement = Array.from(domElem.children).filter(child => child.getElementsByClassName('ng-tooltip'))[0];
        tooltipElement.classList.add(`ng-tooltip-${placement}`);
        tooltipElement.classList.add(`ng-tooltip-show`);
        return domElem;
    }

    private setPosition(domElem: HTMLElement, elHost: ElementRef, placement: PlacementValue): HTMLElement {
        const hostPos = elHost.nativeElement.getBoundingClientRect();
        const tooltipPos = domElem.getBoundingClientRect();
        const scrollPos = window.pageYOffset ||
                          document.documentElement.scrollTop ||
                          document.body.scrollTop ||
                          0;
        let top = 0;
        let left = 0;
        const offset = 10;

        switch (placement) {
          case Placement.Bottom:
            top = hostPos.bottom + offset;
            left = hostPos.left + (hostPos.width - tooltipPos.width) / 2;
            break;
          case Placement.Left:
            top = hostPos.top + (hostPos.height - tooltipPos.height) / 2;
            left = hostPos.left - tooltipPos.width - offset;
            break;
          case Placement.Rigth:
            top = hostPos.top + (hostPos.height - tooltipPos.height) / 2;
            left = hostPos.right + offset;
            break;
          case Placement.Top:
          default:
            top = hostPos.top - tooltipPos.height - offset;
            left = hostPos.left;
            break;
        }
        top = Math.max(0, top);
        left = Math.max(0, left);
        domElem.style.top = `${top + scrollPos}px`;
        domElem.style.left = `${left}px`;
        return domElem;
    }
}
