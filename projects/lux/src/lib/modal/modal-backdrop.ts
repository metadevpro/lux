import { Component, HostBinding, Input } from '@angular/core';

@Component({
  imports: [],
  selector: 'lux-modal-backdrop',
  template: ''
})
export class LuxModalBackdropComponent {
  @Input() backdropClass: string | undefined;

  @HostBinding('class') class = 'modal-backdrop fade show';
  @HostBinding('style') style = 'z-index: 1050';
}
