import { Component, AfterContentInit } from '@angular/core';
import { PrismService } from '../core/services/prism-service.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html'
})
export class MainComponent implements AfterContentInit {
  constructor(private prismService: PrismService) { }

  ngAfterContentInit(): void {
    this.prismService.highlightAll();
  }

}
