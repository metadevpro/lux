import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


import { CheckboxComponent } from './checkbox/checkbox.component';
import { TooltipDirective } from './directives/tooltip.directive';
import { PaginationComponent } from './pagination/pagination.component';
import { InputComponent } from './input/input.component';
import { FilterComponent } from './filter/filter.component';


@NgModule({
  declarations: [
    FilterComponent,
    CheckboxComponent,
    InputComponent,
    TooltipDirective,
    PaginationComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule
  ],
  exports: [
    FilterComponent,
    CheckboxComponent,
    InputComponent,
    TooltipDirective,
    PaginationComponent
  ]
})
export class LuxModule { }
