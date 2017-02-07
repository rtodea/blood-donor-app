import { Component, OnInit, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { MdDialogRef } from '@angular/material';
import { DonorFormService } from '../donor/donor-form.service';
import { Router, NavigationStart } from '@angular/router';
import 'rxjs/add/operator/filter';

@Component({
  moduleId: module.id,
  selector: 'app-donor-register',
  templateUrl: './donor-register.component.html'
})
export class DonorRegisterComponent implements OnInit {

  bloodGroups = DonorFormService.BLOOD_GROUPS;

  submitted = false;
  active = true;

  donor = DonorFormService.createEmptyDonor();
  donorForm: FormGroup;
  formErrors;

  constructor(
    private donorFormService: DonorFormService,
    private router: Router,
    public dialogRef: MdDialogRef<DonorRegisterComponent>
  ) {
    router.events
      .filter(event => event instanceof NavigationStart)
      .subscribe(() => {
        // don't forget to close the door after clicking
        // on a link
        dialogRef.close();
      });
  }

  createUpdateLink(id) {
    return `${window.location.protocol}//${window.location.host}/#/donor/edit/${id}`;
  }

  ngOnInit(): void {
    const { formGroup, formErrors } = this.donorFormService.buildForm(this.donor);
    this.donorForm = formGroup;
    this.formErrors = formErrors;
  }

  onSubmit() {
    this.donorFormService.createOrUpdate(this.donorForm, this.donor).then((persistedDonor) => {
      this.submitted = true;
      this.donor = persistedDonor;
    });
  }
}
