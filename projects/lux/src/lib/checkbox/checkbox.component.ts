import {
  Component,
  Input,
  EventEmitter,
  Output,
  OnInit,
  forwardRef,
  ViewChild,
  ElementRef,
  AfterViewInit
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { languageDetector } from '../lang';

const KEY_SPACE = ' ';

@Component({
  selector: 'lux-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => CheckboxComponent)
    }
  ]
})
export class CheckboxComponent
  implements ControlValueAccessor, OnInit, AfterViewInit
{
  static idCounter = 0;

  @ViewChild('ck', { static: false }) ck: ElementRef;

  private _lang = languageDetector();
  @Input()
  set lang(l: string) {
    if (l !== this._lang) {
      return;
    }
    if (Object.keys(this.literals).includes(l)) {
      this._lang = l;
    } else {
      this._lang = 'en';
    }
  }
  get lang(): string {
    return this._lang;
  }
  private internalValue: boolean;
  @Input()
  get value(): boolean {
    return this.internalValue;
  }
  set value(v: boolean) {
    if (this.internalValue === v) {
      return;
    }
    this.internalValue = v;
    this.syncModel();
    this.valueChange.emit(v);
    this.onChange(v);
  }

  get tabindexValue(): string {
    return this.disabled ? null : '0';
  }

  @Input() label: string = null;
  @Input() name: string = null;
  private _disabled = false;
  @Input()
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(v: boolean) {
    if (v === this._disabled) {
      return;
    }
    this._disabled = v;
    this.syncModel();
  }
  @Input() inputId: string;

  literals = {
    en: {
      yesLabel: 'Yes',
      noLabel: 'No'
    },
    es: {
      yesLabel: 'Sí',
      noLabel: 'No'
    }
  };
  touched = false;

  @Output() valueChange = new EventEmitter<boolean>();

  constructor() {}

  // ControlValueAccessor Interface
  onChange = (value): void => {};
  onTouched = (): void => {};
  writeValue(value: any): void {
    this.value = !!value;
  }
  registerOnChange(onChange: any): void {
    this.onChange = onChange;
  }
  registerOnTouched(onTouched: any): void {
    this.onTouched = onTouched;
  }
  markAsTouched(): void {
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  }
  setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
  }
  // End ControlValueAccessor Interface

  ngOnInit(): void {
    this.inputId = this.inputId
      ? this.inputId
      : `${this.name || 'checkbox'}$${CheckboxComponent.idCounter++}`;
  }
  ngAfterViewInit(): void {
    this.syncModel();
  }

  clicked(): void {
    if (!this.disabled) {
      this.value = !this.internalValue;
      this.markAsTouched();
    }
  }
  onKey(event: KeyboardEvent): void {
    if (event.key === KEY_SPACE && !this.disabled) {
      this.value = !this.internalValue;
      this.markAsTouched();
      event.preventDefault();
    }
  }

  private syncModel(): void {
    if (this.ck) {
      this.ck.nativeElement.checked = this.internalValue;
    }
  }
}
