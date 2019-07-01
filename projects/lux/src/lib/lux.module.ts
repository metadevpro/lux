import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { LuxComponent } from './lux.component';
import { TooltipDirective } from './directives/tooltip.directive';
import { PaginationComponent } from './pagination/pagination.component';
import { InputComponent } from './input/input.component';
import { FilterComponent } from './filter/filter.component';

@NgModule({
  declarations: [
    LuxComponent,
    InputComponent,
    TooltipDirective,
    PaginationComponent,
    FilterComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule
  ],
  exports: [
    LuxComponent,
    InputComponent,
    TooltipDirective,
    PaginationComponent
  ]
})
export class LuxModule { }
