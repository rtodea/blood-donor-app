import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { ModelEventService } from './model-event.service';
import { SocketService } from './socket.service';
import { PatientComponent } from './patient/patient.component';
import { DonorComponent } from './donor/donor.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AppRoutingModule } from './app-routing.module';
import { EsriMapModule } from './esri-map/esri-map.module';
import { RegisterDonorComponent } from './register-donor/register-donor.component';
import { UserTypeToggleComponent } from './user-type-toggle/user-type-toggle.component';


@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    UserTypeToggleComponent,
    DashboardComponent,
    PatientComponent,
    DonorComponent,
    RegisterDonorComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    MaterialModule.forRoot(),
    AppRoutingModule,
    EsriMapModule
  ],
  providers: [
    SocketService,
    ModelEventService
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    UserTypeToggleComponent
  ]
})
export class AppModule { }
