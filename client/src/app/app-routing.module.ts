import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PatientComponent } from './patient/patient.component';
import { DonorComponent } from './donor/donor.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { DonorEditResolver } from './donor-edit/donor-edit.resolver';
import { DonorEditComponent } from './donor-edit/donor-edit.component';
import { DonorRegisterComponent } from './donor-register/donor-register.component';

const appRoutes: Routes = [
  {
    path: 'patient',
    component: PatientComponent
  },
  {
    path: 'donor',
    component: DonorComponent
  },
  {
    path: 'donor/edit/:id',
    component: DonorEditComponent,
    resolve: {
      donor: DonorEditResolver
    }
  },
  {
    path: 'register',
    component: DonorRegisterComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, { useHash: true })
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}
