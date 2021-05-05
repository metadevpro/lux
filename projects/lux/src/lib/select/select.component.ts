import { Component, Input } from '@angular/core';

let sequencer = 0;

@Component({
  selector: 'lux-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss']
})
export class SelectComponent {
  newEntry = '';
  error = null;
  isValidNewEntry = false;

  @Input() id = 'stringList' + sequencer++;
  @Input() disabled = false;
  /** Allow multiple elements */
  @Input() multiple = true;
  @Input() value: string[] = [];
  @Input() placeholder = 'Add new';
  /** If set, check there is no duplicates in the data. */
  @Input() unique = true;
  /** Validation function for new items. Returns error or null if valid */
  @Input() validateItem: (item: string) => string = (_) => null;

  get canAdd(): boolean {
    return this.multiple || this.value.length === 0;
  }
  add(val: string): void {
    this.value.push(val);
    this.newEntry = '';
  }
  remove(index: number): void {
    if (this.value.length > index) {
      this.value.splice(index, 1);
    }
  }
  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter' && !this.error && this.newEntry !== '') {
      // Add on pressing Enter/Return
      this.add(this.newEntry);
    }
  }
  onChangeNewEntry(newValue: string): void {
    if (!newValue) {
      this.isValidNewEntry = false;
      this.error = null;
      return;
    }
    if (this.unique) {
      const found = (this.value || []).find(it => it === newValue);
      this.isValidNewEntry = !found;
      this.error = found
        ? `Value '${newValue}' is already in. Cannot add duplicates.`
        : null;
      if (!this.isValidNewEntry) {
        return;
      }
    }
    this.error = this.validateItem(newValue);
    this.isValidNewEntry = !this.error;
  }
}
