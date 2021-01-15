import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface RadioItem {
  name?: string;
  label: string;
  value: any;
}

@Component({
  selector: 'lux-radiogroup',
  templateUrl: './radiogroup.component.html',
  styleUrls: ['./radiogroup.component.scss']
})
export class RadiogroupComponent {
  @Input() name = 'radiogroup1';
  @Input() public disabled: boolean | null = null;
  @Input() public readonly: boolean | null = null;

  @Input()
  set items(col: RadioItem[]) {
    this._items = (col || []).map((it, index) => this.ensureHasUniqueName(it, index));
    this.itemsChange.emit(col);
  }
  get items(): RadioItem[] {
    return this._items;
  }
  @Output() itemsChange = new EventEmitter<RadioItem[]>();

  @Input()
  set value(v: any) {
    this._value = v;
    this.valueChange.emit(v);
  }
  get value(): any {
    return this._value;
  }
  @Output() valueChange = new EventEmitter<string>();

  private _value: any = undefined;
  private _items: RadioItem[] = [];

  constructor() {}

  setValue(event: MouseEvent, item: RadioItem): void {
    if (!this.disabled && !this.readonly) {
      this.value = item.value;
    }
    event.preventDefault();
  }
  ensureHasUniqueName(item: RadioItem, index: number): RadioItem {
    if (!item.name) {
      item.name = `${this.name}_${index}`;
    }
    return item;
  }
}
