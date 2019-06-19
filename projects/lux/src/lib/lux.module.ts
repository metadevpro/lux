import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LuxComponent } from './lux.component';
import { TooltipDirective } from './directives/tooltip.directive';
import { PaginationComponent } from './pagination/pagination.component';

@NgModule({
  declarations: [
    LuxComponent,
    TooltipDirective,
    PaginationComponent],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    LuxComponent,
    TooltipDirective
  ]
})
export class LuxModule { }
