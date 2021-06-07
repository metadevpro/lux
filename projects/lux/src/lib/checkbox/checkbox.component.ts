import { Component, Input, EventEmitter, Output, OnInit } from '@angular/core';

const KEY_SPACE = ' ';

@Component({
  selector: 'lux-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss']
})
export class CheckboxComponent implements OnInit {
  static idCounter = 0;

  private internalValue: boolean;
  @Input()
  get value(): boolean {
    return this.internalValue;
  }
  set value(v: boolean) {
    this.internalValue = v;
    this.valueChange.emit(v);
  }

  get tabindexValue(): string {
    return this.disabled ? null : '0';
  }

  @Input() label: string = null;
  @Input() name: string = null;
  @Input() disabled = false;
  @Input() inputId: string;

  yesLabel = 'Yes';
  noLabel = 'No';

  @Output() valueChange = new EventEmitter<boolean>();

  constructor() {}

  ngOnInit() {
    this.inputId = this.inputId
      ? this.inputId
      : `${this.name || 'checkbox'}$${CheckboxComponent.idCounter++}`;
  }

  clicked(): void {
    if (!this.disabled) {
      this.value = !this.value;
    }
  }
  onKey(event: KeyboardEvent): void {
    if (event.key === KEY_SPACE && !this.disabled) {
      this.value = !this.value;
      event.preventDefault();
    }
  }
}
