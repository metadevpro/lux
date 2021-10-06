import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LuxModule } from 'projects/lux/src/public-api';
import { AutoCompleteSampleComponent } from './autocomplete-sample/autocomplete-sample.component';
import { AutoCompleteListSampleComponent } from './autocomplete-list-sample/autocomplete-list-sample.component';
import { AppComponent } from './app.component';
import { BreadcrumbSampleComponent } from './breadcrumb-sample/breadcrumb-sample.component';
import { CheckboxSampleComponent } from './checkbox-sample/checkbox-sample.component';
import { DatetimeSampleComponent } from './datetime-sample/datetime-sample.component';
import { InputSampleComponent } from './input-sample/input-sample.component';
import { FilterSampleComponent } from './filter-sample/filter-sample.component';
import { GeolocationSampleComponent } from './geolocation-sample/geolocation-sample.component';
import { MapSampleComponent } from './map-sample/map-sample.component';
import { MainComponent } from './main/main.component';
import { PaginationSampleComponent } from './pagination-sample/pagination-sample.component';
import { TooltipSampleComponent } from './tooltip-sample/tooltip-sample.component';
import { CoreModule } from './core/core.module';
import { PrismService } from './core/services/prism-service.service';
import { toString } from './datetime-sample/toString.pipe';
import { ModalSampleComponent } from './modal-sample/modal-sample.component';
import { SelectSampleComponent } from './select-sample/select-sample.component';
import { TooltipComponent } from './tooltip-sample/tooltip';
import { RadiogroupSampleComponent } from './radiogroup-sample/radiogroup-sample.component';
import { VoicerecognitionSampleComponent } from './voicerecognition-sample/voicerecognition-sample.component';

const appRoutes: Routes = [
  { path: '', component: MainComponent },
  { path: 'autocomplete', component: AutoCompleteSampleComponent },
  { path: 'autocomplete-list', component: AutoCompleteListSampleComponent },
  { path: 'breadcrumb', component: BreadcrumbSampleComponent },
  { path: 'checkbox', component: CheckboxSampleComponent },
  { path: 'datetime', component: DatetimeSampleComponent },
  { path: 'index', component: MainComponent },
  { path: 'filter', component: FilterSampleComponent },
  { path: 'geolocation', component: GeolocationSampleComponent },
  { path: 'map', component: MapSampleComponent },
  { path: 'input', component: InputSampleComponent },
  { path: 'pagination', component: PaginationSampleComponent },
  { path: 'modal', component: ModalSampleComponent },
  { path: 'select', component: SelectSampleComponent },
  { path: 'tooltip', component: TooltipSampleComponent },
  { path: 'radiogroup', component: RadiogroupSampleComponent },
  { path: 'voicerecognition', component: VoicerecognitionSampleComponent },
  { path: '**', component: MainComponent }
];

@NgModule({
  declarations: [
    AutoCompleteSampleComponent,
    AutoCompleteListSampleComponent,
    MainComponent,
    AppComponent,
    CheckboxSampleComponent,
    DatetimeSampleComponent,
    FilterSampleComponent,
    GeolocationSampleComponent,
    MapSampleComponent,
    TooltipSampleComponent,
    InputSampleComponent,
    PaginationSampleComponent,
    SelectSampleComponent,
    TooltipComponent,
    BreadcrumbSampleComponent,
    ModalSampleComponent,
    RadiogroupSampleComponent,
    VoicerecognitionSampleComponent,
    toString
  ],
  imports: [
    CoreModule,
    FormsModule,
    ReactiveFormsModule,
    LuxModule,
    BrowserModule,
    RouterModule.forRoot(appRoutes)
  ],
  entryComponents: [TooltipComponent],
  providers: [PrismService],
  bootstrap: [AppComponent]
})
export class AppModule {}
