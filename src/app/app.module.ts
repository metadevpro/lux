import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LuxModule } from 'projects/lux/src/public-api';
import { AppComponent } from './app.component';
import { BreadcrumbSampleComponent } from './breadcrumb-sample/breadcrumb-sample.component';
import { CheckboxSampleComponent } from './checkbox-sample/checkbox-sample.component';
import { InputSampleComponent } from './input-sample/input-sample.component';
import { FilterSampleComponent } from './filter-sample/filter-sample.component';
import { MainComponent } from './main/main.component';
import { PaginationSampleComponent } from './pagination-sample/pagination-sample.component';
import { TooltipSampleComponent } from './tooltip-sample/tooltip-sample.component';
import { CoreModule } from './core/core.module';
import { PrismService } from './core/services/prism-service.service';
import { ModalSampleComponent } from './modal-sample/modal-sample.component';
import { TooltipComponent } from './tooltip-sample/tooltip';
import { RadiogroupSampleComponent } from './radiogroup-sample/radiogroup-sample.component';

const appRoutes: Routes = [
  { path: '', component: MainComponent },
  { path: 'breadcrumb', component: BreadcrumbSampleComponent },
  { path: 'checkbox', component: CheckboxSampleComponent },
  { path: 'index', component: MainComponent },
  { path: 'filter', component: FilterSampleComponent },
  { path: 'input', component: InputSampleComponent },
  { path: 'tooltip', component: TooltipSampleComponent },
  { path: 'pagination', component: PaginationSampleComponent },
  { path: 'modal', component: ModalSampleComponent },
  { path: 'radiogroup', component: RadiogroupSampleComponent },
  { path: '**', component: MainComponent },
];

@NgModule({
  declarations: [
    MainComponent,
    AppComponent,
    CheckboxSampleComponent,
    FilterSampleComponent,
    TooltipSampleComponent,
    InputSampleComponent,
    PaginationSampleComponent,
    TooltipComponent,
    BreadcrumbSampleComponent,
    ModalSampleComponent,
    RadiogroupSampleComponent,
  ],
  imports: [
    CoreModule,
    LuxModule,
    BrowserModule,
    RouterModule.forRoot(appRoutes),
  ],
  entryComponents: [TooltipComponent],
  providers: [PrismService],
  bootstrap: [AppComponent],
})
export class AppModule {}
