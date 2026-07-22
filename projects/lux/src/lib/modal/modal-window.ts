import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
  inject
} from '@angular/core';

import { ModalDismissReasons } from './modal-dismiss-reasons';
import { FOCUS, getFocusableBoundaryElements } from './util';

@Component({
  selector: 'lux-modal-window',
  imports: [],
  template: `
    <div class="modal-dialog" role="document">
      <div class="modal-content"><ng-content></ng-content></div>
    </div>
  `
})
export class LuxModalWindowComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  private _document = inject(DOCUMENT);
  private _elRef = inject<ElementRef<HTMLElement>>(ElementRef);

  private _elWithFocus: Element | null | undefined; // element that is focused prior to modal opening

  @Input() ariaDescribedBy: string | undefined;
  @Input() ariaLabelledBy: string | undefined;
  @Input() backdrop: boolean | string = false;
  @Input() keyboard = true;
  @Input() windowClass: string | undefined;

  @Output() dismissEvent = new EventEmitter();

  @HostBinding('class') get class(): string {
    return `modal ${this.windowClass || ''}`;
  }
  @HostBinding('attr.role') role = 'dialog';
  @HostBinding('tabindex') tabindex = '-1';
  @HostBinding('attr.aria-modal') ariamodal = true;
  @HostBinding('attr.aria-labelledby') get hostAriaLabelledBy():
    | string
    | undefined {
    return this.ariaLabelledBy;
  }
  @HostBinding('attr.aria-describedby') get hostAriaDescribedBy():
    | string
    | undefined {
    return this.ariaDescribedBy;
  }
  @HostListener('click', ['$event']) backdropClick(event: any): void {
    const btn: HTMLElement = event.target;
    if (this.backdrop === true && this._elRef.nativeElement === btn) {
      this.dismiss(ModalDismissReasons.BackdropClick);
    }
  }
  @HostListener('keyup.esc', ['$event']) escKey(event: any): void {
    if (this.keyboard && !event.defaultPrevented) {
      this.dismiss(ModalDismissReasons.Esc);
    }
  }

  dismiss(reason: any): void {
    this.dismissEvent.emit(reason);
  }

  ngOnInit(): void {
    this._elWithFocus = this._document.activeElement;
  }

  ngAfterViewInit(): void {
    if (!this._elRef.nativeElement.contains(document.activeElement)) {
      const firstFocusable = getFocusableBoundaryElements(
        this._elRef.nativeElement
      )[0];

      const elementToFocus = firstFocusable || this._elRef.nativeElement;
      elementToFocus.focus();
    }
  }

  ngOnDestroy(): void {
    const body = this._document.body;
    const elWithFocus = this._elWithFocus;

    let elementToFocus: any;
    if (
      elWithFocus &&
      (elWithFocus as any)[FOCUS] &&
      body.contains(elWithFocus)
    ) {
      elementToFocus = elWithFocus;
    } else {
      elementToFocus = body;
    }
    elementToFocus.focus();
    this._elWithFocus = null;
  }
}
