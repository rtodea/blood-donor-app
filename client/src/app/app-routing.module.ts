import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PatientComponent } from './patient/patient.component';
import { DonorComponent } from './donor/donor.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

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
    path: 'donor/:id',
    component: DonorComponent
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
