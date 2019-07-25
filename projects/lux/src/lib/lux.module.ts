import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


import { CheckboxComponent } from './checkbox/checkbox.component';
import { TooltipDirective } from './directives/tooltip.directive';
import { PaginationComponent } from './pagination/pagination.component';
import { InputComponent } from './input/input.component';
import { FilterComponent } from './filter/filter.component';
import { LuxTooltipDirective } from './directives/tooltip2.directive';
import { TooltipComponent } from './directives/tooltip.component';
import { TooltipService } from './directives/tooltip.service';


@NgModule({
  declarations: [
    FilterComponent,
    CheckboxComponent,
    InputComponent,
    TooltipDirective,
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
    TooltipDirective,
    LuxTooltipDirective,
    PaginationComponent
  ]
})
export class LuxModule { }
