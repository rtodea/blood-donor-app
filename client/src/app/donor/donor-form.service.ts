import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DonorService } from '../shared/donor.service';
import { validateContactNumber, validateEmail } from './donor-form.validations';
import { Donor } from '../shared/donor';

@Injectable()
export class DonorFormService {

  static BLOOD_GROUPS = ['O−', 'A−', 'B−', 'AB−', 'O+', 'A+', 'B+', 'AB+'];

  static FORM_ERRORS = {
    firstName: '',
    lastName: '',
    contactNo: '',
    email: '',
    bloodGroup: ''
  };

  static VALIDATION_MESSAGES = {
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

  static createEmptyDonor() {
    return new Donor(
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
  }

  constructor(
    private formBuilder: FormBuilder,
    private donorService: DonorService,
  ) { }

  buildForm(donor) {
    const formGroup = this.formBuilder.group({
      'firstName': [donor.firstName, [Validators.required]],
      'lastName': [donor.lastName, [Validators.required]],
      'contactNo': [donor.contactNo, [
        Validators.required,
        validateContactNumber
      ]],
      'email': [donor.email, [
        Validators.required,
        validateEmail
      ]],
      'bloodGroup': [donor.bloodGroup, [Validators.required]],
    });

    const formErrors = Object.assign({}, DonorFormService.FORM_ERRORS);
    formGroup.valueChanges.subscribe((data) => this.onValueChanged(formGroup, formErrors, data));
    this.onValueChanged(formGroup, formErrors);

    return { formGroup, formErrors };
  }

  onValueChanged(formGroup, formErrors, data?: any) {
    if (!formGroup) {
      return;
    }
    const form = formGroup;
    Object.keys(formErrors).forEach((field) => {
      // clear previous error message (if any)
      formErrors[field] = '';
      const control = form.get(field);
      if (control && control.dirty && !control.valid) {
        const messages = DonorFormService.VALIDATION_MESSAGES[field];
        Object.keys(control.errors).forEach((key) => {
          formErrors[field] += messages[key] + ' ';
        });
      }
    });
  }

  createOrUpdate(donorForm, donor) {
    const preparedDonor = this.prepareDonorForSave(donorForm, donor);
    return this.donorService.createOrUpdate(preparedDonor);
  }

  prepareDonorForSave(donorForm, donor) {
    const formModel = donorForm.value;

    // add IP data
    return Object.assign({}, donor, formModel);
  }
}
