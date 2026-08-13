import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { VERSION } from 'src/environments/version';
import { LuxBreadcrumbComponent } from '../../projects/lux/src/lib/breadcrumb/breadcrumb.component';

@Component({
  standalone: true,
  imports: [RouterModule, RouterOutlet, LuxBreadcrumbComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  version = VERSION;
  title = 'lux-demo';

  constructor() {}
}
