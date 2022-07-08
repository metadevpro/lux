import { Component } from '@angular/core';
import { VERSION } from 'src/environments/version';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  version = VERSION;
  title = 'lux-demo';

  constructor() {}
}
