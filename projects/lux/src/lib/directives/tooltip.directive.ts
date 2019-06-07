import { Directive, Input, ElementRef, HostListener, Renderer2 } from '@angular/core';

enum Placement {
  Top = 'top',
  Bottom = 'bottom',
  Left = 'left',
  Rigth = 'right'
}
type PlacementValue = 'left' | 'right' | 'top' | 'bottom';

/**
 * Tooltip directive. Shows a tooltip in any element.
 * Delay and placement are configurable.
 * Allowed placement: top (default), bottom, left, right
 * Delay: in milliseconds. Default to 200 ms
 *
 * Tooltip CSS styles can be override using:
 *  .ng-tooltip-show
 *  .ng-tooltip
 *  .ng-tooltip-top
 *  .ng-tooltip-bottom
 *  .ng-tooltip-left
 *  .ng-tooltip-right
 */
@Directive({
  selector: '[luxTooltip]'
})
export class TooltipDirective {
  /** tooltip title */
  @Input('luxTooltip') tooltipTitle: string;

  /** Placement */
  @Input() placement: PlacementValue;

  /** Delay in milliseconds */
  @Input() delay = 200;

  tooltip: HTMLElement;
  offset = 10;

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  @HostListener('mouseenter') onMouseEnter() {
    if (!this.tooltip) { this.show(); }
  }

  @HostListener('mouseleave') onMouseLeave() {
    if (this.tooltip) { this.hide(); }
  }

  @HostListener('click') onClick() {
    if (this.tooltip) { this.hide(); }
  }

  show() {
    this.create();
    this.setPosition();
    this.renderer.addClass(this.tooltip, 'ng-tooltip-show');
  }

  hide() {
    this.renderer.removeClass(this.tooltip, 'ng-tooltip-show');
    setTimeout(() => {
      if (this.tooltip) {
        this.renderer.removeChild(document.body, this.tooltip);
        this.tooltip = null;
      }
    }, this.delay);
  }

  create() {
    this.tooltip = this.renderer.createElement('span');
    this.renderer.appendChild(
      this.tooltip,
      this.renderer.createText(this.tooltipTitle)
    );
    this.renderer.appendChild(document.body, this.tooltip);
    this.renderer.addClass(this.tooltip, 'ng-tooltip');
    this.renderer.addClass(this.tooltip, `ng-tooltip-${this.placement}`);
    this.renderer.setStyle(this.tooltip, 'transition', `opacity ${this.delay}ms`);
  }

  setPosition() {
    const hostPos = this.el.nativeElement.getBoundingClientRect();
    const tooltipPos = this.tooltip.getBoundingClientRect();
    const scrollPos = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    let top;
    let left;

    switch (this.placement) {
      case Placement.Bottom:
        top = hostPos.bottom + this.offset;
        left = hostPos.left + (hostPos.width - tooltipPos.width) / 2;
        break;
      case Placement.Left:
        top = hostPos.top + (hostPos.height - tooltipPos.height) / 2;
        left = hostPos.left - tooltipPos.width - this.offset;
        break;
      case Placement.Rigth:
        top = hostPos.top + (hostPos.height - tooltipPos.height) / 2;
        left = hostPos.right + this.offset;
        break;
      case Placement.Top:
      default:
        top = hostPos.top - tooltipPos.height - this.offset;
        left = hostPos.left + (hostPos.width - tooltipPos.width) / 2;
        break;
    }

    this.renderer.setStyle(this.tooltip, 'top', `${top + scrollPos}px`);
    this.renderer.setStyle(this.tooltip, 'left', `${left}px`);
  }
}
