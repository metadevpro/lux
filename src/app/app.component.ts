import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { VERSION } from 'src/environments/version';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  version = VERSION;
  title = 'lux-demo';

  constructor() {}
}
