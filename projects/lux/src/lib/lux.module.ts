import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { LuxComponent } from './lux.component';
import { TooltipDirective } from './directives/tooltip.directive';
import { PaginationComponent } from './pagination/pagination.component';
import { InputComponent } from './input/input.component';

@NgModule({
  declarations: [
    LuxComponent,
    InputComponent,
    TooltipDirective,
    PaginationComponent],
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  exports: [
    LuxComponent,
    InputComponent,
    TooltipDirective
    PaginationComponent
  ]
})
export class LuxModule { }
