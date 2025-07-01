import { AfterContentInit, Component, inject } from '@angular/core';
import { PrismService } from '../core/services/prism-service.service';

@Component({
  standalone: false,

  selector: 'app-breadcrumb-sample',
  templateUrl: './breadcrumb-sample.component.html',
  styleUrls: ['./breadcrumb-sample.component.scss']
})
export class BreadcrumbSampleComponent implements AfterContentInit {
  private prismService = inject(PrismService);

  ngAfterContentInit(): void {
    this.prismService.highlightAll();
  }
}
