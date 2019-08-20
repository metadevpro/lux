import { Injectable, Injector, ComponentRef, ComponentFactoryResolver,
         ApplicationRef, EmbeddedViewRef, ElementRef, TemplateRef } from '@angular/core';

import { PlacementValue, Placement } from './placement';
import { LuxTooltipContext } from './tooltip-context';
import { TooltipComponent } from './tooltip.component';
import { TooltipContentRef } from './tooltop-content';

@Injectable()
export class TooltipService {

    constructor(private _injector: Injector,
                private _crf: ComponentFactoryResolver,
                private _applicationRef: ApplicationRef) { }

    appendComponentToBody(content: any, elHost: ElementRef, placement: PlacementValue): TooltipContentRef {
      const tooltipContentRef = this.getTooltipContentRef(content);
      let domElem = (tooltipContentRef.viewRef as EmbeddedViewRef<any>)
                      .rootNodes[0];
      document.body.appendChild(domElem);
      if (tooltipContentRef.componentRef) {
        tooltipContentRef.componentRef.changeDetectorRef.detectChanges();
      }
      domElem = this.setStyle(domElem, placement);
      domElem = this.setPosition(domElem, elHost, placement);
      return tooltipContentRef;
    }

    removeComponentFromBody(tooltipContentRef: TooltipContentRef) {
        this._applicationRef.detachView(tooltipContentRef.viewRef);
        if (tooltipContentRef.componentRef) {
          tooltipContentRef.componentRef.destroy();
        }
    }

    private getTooltipContentRef(content: any): TooltipContentRef {
      if (!content) {
        return this.createFromComponent(TooltipComponent, { message: 'Tooltip' });
      } else if (content instanceof TemplateRef) {
        return this.createFromTemplateRef(content);
      } else if (typeof(content) === 'string') {
        return this.createFromComponent(TooltipComponent, { message: content });
      } else {
        return this.createFromComponent(content);
      }
    }

    private createFromTemplateRef(content: TemplateRef<any>): TooltipContentRef {
      const viewRef = content.createEmbeddedView({});
      this._applicationRef.attachView(viewRef);
      return new TooltipContentRef(viewRef);
    }

    private createFromComponent(component: any, context?: LuxTooltipContext): TooltipContentRef {
      const componentRef: ComponentRef<any> = this._crf.resolveComponentFactory(component)
                          .create(this._injector);
      if (context) {
        componentRef.instance.context = context;
      }
      this._applicationRef.attachView(componentRef.hostView);
      return new TooltipContentRef(componentRef.hostView, componentRef);
    }

    private setStyle(domElem: HTMLElement, placement: PlacementValue): HTMLElement {
        domElem.style.position = 'absolute';
        domElem.style.minWidth = 'min-content';
        domElem.style.minHeight = 'min-content';
        const tooltipElement = this.getTooltipElementFromHTMLElemnt(domElem);
        placement = placement !== undefined ?
                              placement.toLocaleLowerCase() as PlacementValue : 'top';  // 'Top' is the default value of placement
        tooltipElement.classList.add(`lux-tooltip-${placement}`);
        tooltipElement.classList.add(`lux-tooltip-show`);
        return domElem;
    }

    private getTooltipElementFromHTMLElemnt(domElem: HTMLElement): any {
      const elementsArray = Array.from(domElem.classList).filter(className => className === 'lux-tooltip');
      if (elementsArray.length !== 0) {
        return domElem;
      } else if (domElem.hasChildNodes()) {
        const childrenArray = Array.from(domElem.children)
                                    .filter(child => this.getTooltipElementFromHTMLElemnt(child as HTMLElement) !== null);
        if (childrenArray.length !== 0) {
          return this.getTooltipElementFromHTMLElemnt(childrenArray[0] as HTMLElement);
        } else {
          return null;
        }
      } else {
        return null;
      }
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

        console.log(`Custom placement: ${placement}, Placement Top class: ${Placement.Bottom}`);

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
            left = hostPos.left + (hostPos.width - tooltipPos.width) / 2;
            break;
        }
        top = Math.max(0, top);
        left = Math.max(0, left);
        domElem.style.top = `${top + scrollPos}px`;
        domElem.style.left = `${left}px`;
        return domElem;
    }
}
