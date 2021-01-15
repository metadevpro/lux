import { Component, AfterContentInit } from '@angular/core';
import { RadioItem } from 'projects/lux/src/lib/radiogroup/radiogroup.component';
import { PrismService } from '../core/services/prism-service.service';

@Component({
  selector: 'app-radiogroup-sample',
  templateUrl: './radiogroup-sample.component.html'
})
export class RadiogroupSampleComponent implements AfterContentInit {

  carBrands: RadioItem[] = [{
    name: 'radioHonda',
    label: 'Honda',
    value: 'HON'
  }, {
    label: 'Mazda',
    value: 'MZD'
  },{
    label: 'Mitsubishi',
    value: 'MIT'
  },{
    label: 'Lamborghini',
    value: 'LAM'
  }];

  constructor(private prismService: PrismService) { }

  ngAfterContentInit(): void {
    this.prismService.highlightAll();
  }

}
