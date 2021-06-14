import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild
} from '@angular/core';
import { ModalService } from '../modal/modal.service';
import { InputComponent } from '../input/input.component';

@Component({
  selector: 'lux-geolocation',
  templateUrl: './geolocation.component.html',
  styleUrls: ['./geolocation.component.scss']
})
export class GeolocationComponent {
  private _disabled: string | boolean;
  private _value: any;
  private _required: boolean;

  @ViewChild('latitude', { static: true }) latitude: InputComponent;
  @ViewChild('longitude', { static: true }) longitude: InputComponent;

  get className(): string {
    return this.checkClassName();
  }

  @Input('aria-label') public ariaLabel: string;
  @Input() public readonly: boolean | null = null;

  @Input()
  set disabled(v: string | boolean) {
    this.latitude.disabled = v;
    this.longitude.disabled = v;
  }
  get disabled(): string | boolean {
    return this._disabled;
  }

  @Input()
  set required(v: boolean) {
    this._required = v;
    this.latitude.required = v;
    this.longitude.required = v;
  }
  get required(): boolean {
    return this._required;
  }

  @Input()
  set value(v: any) {
    if (v === this._value) {
      return; // prevent events when there is no changes
    }
    if (v.coordinates && v.coordinates.length === 2) {
      this._value = v;
      this.latitude.value = v.coordinates[1];
      this.longitude.value = v.coordinates[0];
    }
    this.valueChange.emit(v);
  }
  get value(): any {
    this._value = {
      type: 'Point',
      coordinates: [this.longitude.value, this.latitude.value]
    };
    return this._value;
  }

  @Output() valueChange = new EventEmitter<any>();

  constructor(private modalService: ModalService) {}

  onKeyUpLatitude(newLatitude: string): void {
    this.value = {
      type: 'Point',
      coordinates: [this.longitude.value, +newLatitude]
    };
  }
  onChangeLatitude(newLatitude: string): void {
    this.value = {
      type: 'Point',
      coordinates: [this.longitude.value, +newLatitude]
    };
  }
  onKeyUpLongitude(newLongitude: string): void {
    this.value = {
      type: 'Point',
      coordinates: [+newLongitude, this.latitude.value]
    };
  }
  onChangeLongitude(newLongitude: string): void {
    this.value = {
      type: 'Point',
      coordinates: [+newLongitude, this.latitude.value]
    };
  }

  checkClassName(): string {
    if (this.readonly === true) {
      return 'readonly';
    }
    return '';
  }
}
