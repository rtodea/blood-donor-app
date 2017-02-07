import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Donor } from '../shared/donor';
import { validateEmail, validateContactNumber } from '../register-donor/register-donor.validations';
import { DonorService } from '../shared/donor.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  moduleId: module.id,
  selector: 'app-edit-donor',
  templateUrl: './edit-donor.component.html'
})
export class EditDonorComponent implements OnInit {
  bloodGroups = ['O−', 'A−', 'B−', 'AB−', 'O+', 'A+', 'B+', 'AB+'];

  updated = false;
  active = true;
  deleted = false;
  locationChanged = false;

  editedDonorLocation;
  donor;
  donorForm: FormGroup;

  formErrors = {
    firstName: '',
    lastName: '',
    contactNo: '',
    email: '',
    bloodGroup: ''
  };

  validationMessages = {
    firstName: {required: 'First name is required.'},
    lastName: {required: 'Last name is required.'},
    contactNo: {
      required: 'Contact number is required.',
      validateContactNumber: 'Contact number is not valid'
    },
    email: {
      required: 'Email address is required.',
      validateEmail: 'Email address is not valid'
    },
    bloodGroup: {required: 'Blood group is required.'}
  };

  constructor(
    private formBuilder: FormBuilder,
    private donorService: DonorService,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.donor = this.activatedRoute.snapshot.data['donor'];
    this.buildForm();
  }

  onUpdate() {
    this.donorService.createOrUpdate(this.prepareDonorForSave()).then((persistedDonor) => {
      this.updated = true;
      this.donor = persistedDonor;
      this.editedDonorLocation = {
        zoom: 12,
        longitude: this.donor.longitude,
        latitude: this.donor.latitude
      };
    });
  }

  buildForm(): void {
    this.donorForm = this.formBuilder.group({
      'firstName': [this.donor.firstName, [Validators.required]],
      'lastName': [this.donor.lastName, [Validators.required]],
      'contactNo': [this.donor.contactNo, [
        Validators.required,
        validateContactNumber
      ]],
      'email': [this.donor.email, [
        Validators.required,
        validateEmail
      ]],
      'bloodGroup': [this.donor.bloodGroup, [Validators.required]],
    });
    this.donorForm.valueChanges
      .subscribe(data => this.onValueChanged(data));
    this.onValueChanged(); // (re)set validation messages now
  }

  prepareDonorForSave(): Donor {
    const formModel = this.donorForm.value;

    // add IP data
    return Object.assign({}, this.donor, formModel);
  }

  onValueChanged(data?: any) {
    if (!this.donorForm) {
      return;
    }
    const form = this.donorForm;
    Object.keys(this.formErrors).forEach((field) => {
      // clear previous error message (if any)
      this.formErrors[field] = '';
      const control = form.get(field);
      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        Object.keys(control.errors).forEach((key) => {
          this.formErrors[field] += messages[key] + ' ';
        });
      }
    });
  }

  deleteDonor(id) {
    this.donorService.delete(id).then(() => {
      this.deleted = true;
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
}
