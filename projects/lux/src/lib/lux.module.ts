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
import { LuxBreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { RouterModule } from '@angular/router';
import { ModalService } from './modal/modal.service';
import { LuxModalWindowComponent } from './modal/modal-window';
import { LuxModalBackdropComponent } from './modal/modal-backdrop';


@NgModule({
  declarations: [
    FilterComponent,
    CheckboxComponent,
    InputComponent,
    LuxTooltipDirective,
    TooltipComponent,
    PaginationComponent,
    LuxModalWindowComponent,
    LuxModalBackdropComponent
    LuxBreadcrumbComponent
  ],
  entryComponents: [LuxModalWindowComponent, LuxModalBackdropComponent],
  providers: [ModalService],
  providers: [TooltipService],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    CommonModule
  ],
  entryComponents: [TooltipComponent],
  exports: [
    FilterComponent,
    CheckboxComponent,
    InputComponent,
    LuxTooltipDirective,
    PaginationComponent,
    LuxBreadcrumbComponent
  ]
})
export class LuxModule { }
