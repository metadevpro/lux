import { Component, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'lux-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss']
})
export class CheckboxComponent {

  private internalValue: boolean;
  key = '';
  @Input()
  get value(): boolean {
    return this.internalValue;
  }
  set value(v: boolean) {
    this.internalValue = v;
    this.valueChange.emit(v);
  }

  @Input() label: string = null;
  @Input() name: string = null;
  @Input() disabled = false;

  yesLabel = 'Yes';
  noLabel = 'No';

  @Output() valueChange = new EventEmitter<boolean>();

  constructor() {
  }

  clicked() {
    // alert(this.value);
    if (!this.disabled) {
      this.value = !this.value;
    }
  }
  onKey(event) {
    this.key = event.value;
    if (event.keyCode === 32) {
      if (!this.disabled) {
        this.value = !this.value;
      }
    }
  }

}
