import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-input-sample',
  styleUrls: ['input-sample.component.scss'],
  templateUrl: './input-sample.component.html'
})
export class InputSampleComponent implements OnInit {

  value = 'Prueba';
  disabled = true;
  readonly = true;

  constructor() { }

  ngOnInit() {
  }

}
