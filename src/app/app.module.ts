import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { TooltipSampleComponent } from './tooltip-sample/tooltip-sample.component';
import { MainComponent } from './main/main.component';
import { LuxModule } from 'projects/lux/src/public-api';
import { PaginationSampleComponent } from './pagination-sample/pagination-sample.component';
import { CoreModule } from './core/core.module';
import { InputSampleComponent } from './input-sample/input-sample.component';
import { CheckboxSampleComponent } from './checkbox-sample/checkbox-sample.component';
import { PrismService } from './core/services/prism-service.service';

const appRoutes: Routes = [
  { path: '',       component: MainComponent },
  { path: 'checkbox',  component: CheckboxSampleComponent },
  { path: 'index',  component: MainComponent },
  { path: 'input', component: InputSampleComponent },
  { path: 'tooltip',  component: TooltipSampleComponent },
  { path: 'pagination', component: PaginationSampleComponent },
  { path: '**', component: MainComponent }
];

@NgModule({
  declarations: [
    MainComponent,
    AppComponent,
    TooltipSampleComponent,
    InputSampleComponent,
    PaginationSampleComponent,
    CheckboxSampleComponent
  ],
  imports: [
    CoreModule,
    LuxModule,
    BrowserModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [
    PrismService
  ],
  bootstrap: [ AppComponent]
})
export class AppModule { }
