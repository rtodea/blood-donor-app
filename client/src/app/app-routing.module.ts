import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PatientComponent } from './patient/patient.component';
import { DonorComponent } from './donor/donor.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { RegisterDonorComponent } from './register-donor/register-donor.component';
import { EditDonorComponent } from './edit-donor/edit-donor.component';
import { EditDonorResolver } from './edit-donor/edit-donor.resolver';

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
    component: EditDonorComponent,
    resolve: {
      donor: EditDonorResolver
    }
  },
  {
    path: 'register',
    component: RegisterDonorComponent
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
