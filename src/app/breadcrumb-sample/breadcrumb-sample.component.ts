import { Component, OnInit, AfterContentInit } from '@angular/core';
import { PrismService } from '../core/services/prism-service.service';

@Component({
  selector: 'app-breadcrumb-sample',
  templateUrl: './breadcrumb-sample.component.html',
  styleUrls: ['./breadcrumb-sample.component.scss']
})
export class BreadcrumbSampleComponent implements AfterContentInit {

  constructor(private prismService: PrismService) { }

  ngAfterContentInit(): void {
    this.prismService.highlightAll();
  }

}
