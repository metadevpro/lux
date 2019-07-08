import { Component, Input, EventEmitter, Output  } from '@angular/core';

@Component({
  selector: 'lux-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss']
})
export class CheckboxComponent  {

  private internalValue: boolean;
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
    if (!this.disabled) {
      this.value = !this.value;
    }
  }

}
