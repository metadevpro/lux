import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AngularResizedEventModule } from 'angular-resize-event';
import { AutocompleteComponent } from './autocomplete/autocomplete.component';
import { AutocompleteListComponent } from './autocomplete-list/autocomplete-list.component';
import { CheckboxComponent } from './checkbox/checkbox.component';
import { DatetimeComponent } from './datetime/datetime.component';
import { InputComponent } from './input/input.component';
import { FilterComponent } from './filter/filter.component';
import { GeolocationComponent } from './geolocation/geolocation.component';
import { HttpClientModule } from '@angular/common/http';
import { LuxTooltipDirective } from './tooltip/tooltip.directive';
import { LuxBreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { LuxModalWindowComponent } from './modal/modal-window';
import { LuxModalBackdropComponent } from './modal/modal-backdrop';
import { MapComponent } from './map/map.component';
import { ModalService } from './modal/modal.service';
import { PaginationComponent } from './pagination/pagination.component';
import { RadiogroupComponent } from './radiogroup/radiogroup.component';
import { SelectComponent } from './select/select.component';
import { TooltipComponent } from './tooltip/tooltip.component';
import { TooltipService } from './tooltip/tooltip.service';
import { VoiceRecognitionDirective } from './voice-recognition/voice-recognition.directive';
import { WINDOW_PROVIDERS } from './window/window.service';

@NgModule({
  declarations: [
    AutocompleteComponent,
    AutocompleteListComponent,
    FilterComponent,
    CheckboxComponent,
    DatetimeComponent,
    InputComponent,
    GeolocationComponent,
    LuxTooltipDirective,
    LuxModalWindowComponent,
    LuxModalBackdropComponent,
    LuxBreadcrumbComponent,
    MapComponent,
    SelectComponent,
    TooltipComponent,
    PaginationComponent,
    RadiogroupComponent,
    VoiceRecognitionDirective
  ],
  entryComponents: [
    LuxModalWindowComponent,
    LuxModalBackdropComponent,
    TooltipComponent
  ],
  providers: [ModalService, TooltipService, WINDOW_PROVIDERS],
  imports: [
    AngularResizedEventModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule,
    CommonModule
  ],
  exports: [
    AutocompleteComponent,
    AutocompleteListComponent,
    FilterComponent,
    CheckboxComponent,
    DatetimeComponent,
    InputComponent,
    GeolocationComponent,
    LuxTooltipDirective,
    LuxBreadcrumbComponent,
    LuxBreadcrumbComponent,
    MapComponent,
    SelectComponent,
    PaginationComponent,
    RadiogroupComponent,
    VoiceRecognitionDirective
  ]
})
export class LuxModule {}
