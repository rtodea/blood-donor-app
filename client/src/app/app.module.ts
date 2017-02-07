import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';

import { SocketService } from './shared/socket.service';
import { ModelEventService } from './shared/model-event.service';
import { ModelService } from './shared/model.service';
import { DonorService } from './shared/donor.service';

import { PatientComponent } from './patient/patient.component';
import { DonorComponent } from './donor/donor.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AppRoutingModule } from './app-routing.module';
import { EsriMapModule } from './esri-map/esri-map.module';
import { DonorRegisterComponent } from './donor-register/donor-register.component';
import { UserTypeToggleComponent } from './user-type-toggle/user-type-toggle.component';
import { DonorEditComponent } from './donor-edit/donor-edit.component';
import { DonorEditResolver } from './donor-edit/donor-edit.resolver';
import { DonorViewComponent } from './donor-view.component/donor-view.component';
import { DonorFormService } from './donor/donor-form.service';


@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    UserTypeToggleComponent,
    DashboardComponent,
    PatientComponent,
    DonorComponent,
    DonorEditComponent,
    DonorRegisterComponent,
    DonorViewComponent
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
    ModelEventService,
    ModelService,
    DonorService,
    DonorFormService,
    DonorEditResolver
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    UserTypeToggleComponent,
    DonorViewComponent
  ]
})
export class AppModule { }
