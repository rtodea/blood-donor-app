import { Component, OnInit, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Donor } from '../shared/donor';
import { validateEmail, validateContactNumber } from './register-donor.validations';
import { MdDialogRef } from '@angular/material';
import { DonorService } from '../shared/donor.service';

@Component({
  moduleId: module.id,
  selector: 'app-register-donor',
  templateUrl: './register-donor.component.html'
})
export class RegisterDonorComponent implements OnInit {
  bloodGroups = ['O−', 'A−', 'B−', 'AB−', 'O+', 'A+', 'B+', 'AB+'];

  submitted = false;
  active = true;

  donor = new Donor(
    null, // id
    '', // firstName
    '', // lastName
    '', // contactNo
    '', // email
    '', // bloodGroup
    0, // longitude
    0, // latitude
    '', // ip
    '', // countryCode
    '', // city
    '' // street
  );

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
    public dialogRef: MdDialogRef<RegisterDonorComponent>
  ) {}

  ngOnInit(): void {
    this.buildForm();
  }

  onSubmit() {
    this.submitted = true;
    this.donorService.createOrUpdate(this.prepareDonorForSave()).then((persistedDonor) => {
      this.donor = persistedDonor;
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

    // TODO: add IP data
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

  createUpdateLink(id) {
    return `${window.location.protocol}//${window.location.host}/#/donor/edit/${id}`;
  }
}
