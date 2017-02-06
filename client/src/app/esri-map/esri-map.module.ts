import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EsriMapComponent } from './esri-map.component';

import { EsriLoaderService } from 'angular2-esri-loader';
import { Angular2Esri4Module } from 'angular2-esri4-components';

@NgModule({
  imports: [
    CommonModule,
    Angular2Esri4Module,
  ],
  declarations: [EsriMapComponent],
  providers: [EsriLoaderService],
  exports: [EsriMapComponent]
})
export class EsriMapModule { }
