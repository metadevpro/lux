import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


import { CheckboxComponent } from './checkbox/checkbox.component';
import { LuxTooltipDirective } from './tooltip/tooltip.directive';
import { PaginationComponent } from './pagination/pagination.component';
import { InputComponent } from './input/input.component';
import { FilterComponent } from './filter/filter.component';
import { TooltipComponent } from './tooltip/tooltip.component';
import { TooltipService } from './tooltip/tooltip.service';


@NgModule({
  declarations: [
    FilterComponent,
    CheckboxComponent,
    InputComponent,
    LuxTooltipDirective,
    TooltipComponent,
    PaginationComponent
  ],
  providers: [TooltipService],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule
  ],
  entryComponents: [TooltipComponent],
  exports: [
    FilterComponent,
    CheckboxComponent,
    InputComponent,
    LuxTooltipDirective,
    PaginationComponent
  ]
})
export class LuxModule { }
