import { NgModule } from '@angular/core';
import { LuxComponent } from './lux.component';
import { TooltipDirective } from './directives/tooltip.directive';

@NgModule({
  declarations: [
    LuxComponent,
    TooltipDirective],
  imports: [],
  exports: [
    LuxComponent,
    TooltipDirective
  ]
})
export class LuxModule { }
