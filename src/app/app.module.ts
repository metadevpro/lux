import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { TooltipSampleComponent } from './tooltip-sample/tooltip-sample.component';
import { MainComponent } from './main/main.component';
import { LuxModule } from 'projects/lux/src/public-api';
import { PaginationSampleComponent } from './pagination-sample/pagination-sample.component';

const appRoutes: Routes = [
  { path: '',       component: MainComponent },
  { path: 'index',  component: MainComponent },
  { path: 'tooltip',  component: TooltipSampleComponent },
  { path: 'pagination', component: PaginationSampleComponent },
  { path: '**', component: MainComponent }
];

@NgModule({
  declarations: [
    MainComponent,
    AppComponent,
    TooltipSampleComponent,
    PaginationSampleComponent
  ],
  imports: [
    LuxModule,
    BrowserModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [],
  bootstrap: [ AppComponent]
})
export class AppModule { }
