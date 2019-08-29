import {Component, Input, HostBinding} from '@angular/core';

@Component({
  selector: 'lux-modal-backdrop',
  template: ''
})
export class LuxModalBackdropComponent {
  @Input() backdropClass: string;

  @HostBinding('class') class = 'modal-backdrop fade show';
  @HostBinding('style') style = 'z-index: 1050';
}
