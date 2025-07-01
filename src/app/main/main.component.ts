import { AfterContentInit, Component, inject } from '@angular/core';
import { PrismService } from '../core/services/prism-service.service';

@Component({
  standalone: false,
  selector: 'app-main',
  templateUrl: './main.component.html'
})
export class MainComponent implements AfterContentInit {
  private prismService = inject(PrismService);

  ngAfterContentInit(): void {
    this.prismService.highlightAll();
  }
}
