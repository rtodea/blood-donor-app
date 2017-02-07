import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EsriMapComponent } from './esri-map.component';

import { EsriLoaderService } from 'angular2-esri-loader';
import { EsriService } from './esri.service';
import { PatientMapService } from './esri-map.patient.service';
import { DonorMapService } from './esri-map.donor.service';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [EsriMapComponent],
  providers: [
    EsriLoaderService,
    EsriService,
    PatientMapService,
    DonorMapService
  ],
  exports: [EsriMapComponent]
})
export class EsriMapModule { }
