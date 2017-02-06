import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EsriMapComponent } from './esri-map.component';

import { EsriLoaderService } from 'angular2-esri-loader';
import { EsriService } from './esri.service';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [EsriMapComponent],
  providers: [
    EsriLoaderService,
    EsriService
  ],
  exports: [EsriMapComponent]
})
export class EsriMapModule { }
