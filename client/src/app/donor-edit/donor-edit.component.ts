import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { ActivatedRoute } from '@angular/router';
import { DonorFormService } from '../donor/donor-form.service';
import { DonorService } from '../shared/donor.service';

@Component({
  moduleId: module.id,
  selector: 'app-donor-edit',
  templateUrl: './donor-edit.component.html'
})
export class DonorEditComponent implements OnInit {

  bloodGroups = DonorFormService.BLOOD_GROUPS;

  active = true;
  deleted = false;
  editedDonorLocation;
  locationChanged = false;
  updated = false;

  donor;
  donorForm: FormGroup;
  formErrors;

  constructor(
    private donorFormService: DonorFormService,
    private donorService: DonorService,
    private activatedRoute: ActivatedRoute,
  ) {}

  deleteDonor(id) {
    this.donorService.delete(id).then(() => {
      this.deleted = true;
    });
  }

  ngOnInit(): void {
    this.donor = this.activatedRoute.snapshot.data['donor'];
    const { formGroup, formErrors } = this.donorFormService.buildForm(this.donor);
    this.donorForm = formGroup;
    this.formErrors = formErrors;  }

  onUpdate() {
    this.donorFormService.createOrUpdate(this.donorForm, this.donor).then((persistedDonor) => {
      this.updated = true;
      this.donor = persistedDonor;
      this.editedDonorLocation = {
        zoom: 12,
        longitude: this.donor.longitude,
        latitude: this.donor.latitude
      };
    });
  }

  updateLocation(mapEvent) {
    const { longitude, latitude } = mapEvent.mapPoint;
    this.donor.longitude = longitude;
    this.donor.latitude = latitude;

    if (mapEvent.address) {
      const { Address, City, CountryCode } = mapEvent.address;
      this.donor.street = Address;
      this.donor.city = City;
      this.donor.countryCode = CountryCode;
    }

    this.locationChanged = true;
  }

  backToEditMode() {
    this.updated = false;
  }
}
