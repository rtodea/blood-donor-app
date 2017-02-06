import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';

import { AppComponent } from './app.component';
import { ModelEventService } from './model-event.service';
import { SocketService } from './socket.service';
import { PatientComponent } from './patient/patient.component';
import { DonorComponent } from './donor/donor.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AppRoutingModule } from './app-routing.module';
import { MapService } from './map.service';
import { EsriMapModule } from './esri-map/esri-map.module';


@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    DashboardComponent,
    PatientComponent,
    DonorComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MaterialModule.forRoot(),
    AppRoutingModule,
    EsriMapModule
  ],
  providers: [
    SocketService,
    ModelEventService,
    MapService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
