import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { CheckboxComponent } from './checkbox/checkbox.component';
import { LuxTooltipDirective } from './tooltip/tooltip.directive';
import { PaginationComponent } from './pagination/pagination.component';
import { InputComponent } from './input/input.component';
import { FilterComponent } from './filter/filter.component';
import { TooltipComponent } from './tooltip/tooltip.component';
import { TooltipService } from './tooltip/tooltip.service';
import { LuxBreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { ModalService } from './modal/modal.service';
import { LuxModalWindowComponent } from './modal/modal-window';
import { LuxModalBackdropComponent } from './modal/modal-backdrop';
import { WINDOW_PROVIDERS } from './window/window.service';


@NgModule({
  declarations: [
    FilterComponent,
    CheckboxComponent,
    InputComponent,
    LuxTooltipDirective,
    TooltipComponent,
    PaginationComponent,
    LuxModalWindowComponent,
    LuxModalBackdropComponent,
    LuxBreadcrumbComponent
  ],
  entryComponents: [LuxModalWindowComponent, LuxModalBackdropComponent, TooltipComponent],
  providers: [ModalService, TooltipService, WINDOW_PROVIDERS],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    CommonModule
  ],
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
