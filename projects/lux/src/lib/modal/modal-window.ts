import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  HostBinding,
  HostListener
} from '@angular/core';

import { getFocusableBoundaryElements, FOCUS } from './util';
import { ModalDismissReasons } from './modal-dismiss-reasons';

@Component({
  selector: 'lux-modal-window',
  template: `
    <div class="modal-dialog" role="document">
      <div class="modal-content"><ng-content></ng-content></div>
    </div>
  `
})
export class LuxModalWindowComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  private _elWithFocus: Element; // element that is focused prior to modal opening

  @Input() ariaDescribedBy: string;
  @Input() ariaLabelledBy: string;
  @Input() backdrop: boolean | string = false;
  @Input() keyboard = true;
  @Input() windowClass: string;

  @Output() dismissEvent = new EventEmitter();

  @HostBinding('class') get class(): string {
    return `modal ${this.windowClass || ''}`;
  }
  @HostBinding('attr.role') role = 'dialog';
  @HostBinding('tabindex') tabindex = '-1';
  @HostBinding('attr.aria-modal') ariamodal = true;
  @HostBinding('attr.aria-labelledby') get hostAriaLabelledBy(): string {
    return this.ariaLabelledBy;
  }
  @HostBinding('attr.aria-describedby') get hostAriaDescribedBy(): string {
    return this.ariaDescribedBy;
  }
  @HostListener('click', ['$event.target']) backdropClick(
    btn: HTMLElement
  ): void {
    if (this.backdrop === true && this._elRef.nativeElement === btn) {
      this.dismiss(ModalDismissReasons.BackdropClick);
    }
  }
  @HostListener('keyup.esc', ['$event']) escKey(event): void {
    if (this.keyboard && !event.defaultPrevented) {
      this.dismiss(ModalDismissReasons.Esc);
    }
  }

  constructor(
    @Inject(DOCUMENT) private _document: any,
    private _elRef: ElementRef<HTMLElement>
  ) {}

  dismiss(reason): void {
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

    let elementToFocus;
    if (elWithFocus && elWithFocus[FOCUS] && body.contains(elWithFocus)) {
      elementToFocus = elWithFocus;
    } else {
      elementToFocus = body;
    }
    elementToFocus.focus();
    this._elWithFocus = null;
  }
}
