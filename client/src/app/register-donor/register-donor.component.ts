import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Donor } from '../shared/donor';

@Component({
  moduleId: module.id,
  selector: 'app-register-donor',
  templateUrl: './register-donor.component.html'
})
export class RegisterDonorComponent implements OnInit {

  bloodGroups = ['O−',	'A−',	'B−',	'AB−',	'O+',	'A+',	'B+',	'AB+'];

  submitted = false;
  active = true;

  donor = new Donor(null, '', '', '', '', '');
  donorForm: FormGroup;

  formErrors = {
    firstName: '',
    lastName: '',
    contactNo: '',
    email: '',
    bloodGroup: ''
  };

  validationMessages = {
    firstName: { required: 'First name is required.'},
    lastName: { required: 'Last name is required.'},
    contactNo: { required: 'Contact number is required.'},
    email: { required: 'Email address is required.'},
    bloodGroup: { required: 'Blood group is required.'}
  };

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.buildForm();
  }

  onSubmit() {
    this.submitted = true;
    this.donor = this.donorForm.value;
  }

  buildForm(): void {
    this.donorForm = this.formBuilder.group({
      'firstName': [this.donor.firstName, [Validators.required]],
      'lastName': [this.donor.lastName, [Validators.required]],
      'contactNo': [this.donor.contactNo, [Validators.required]],
      'email': [this.donor.email, [Validators.required]],
      'bloodGroup': [this.donor.bloodGroup, [Validators.required]],
    });
    this.donorForm.valueChanges
      .subscribe(data => this.onValueChanged(data));
    this.onValueChanged(); // (re)set validation messages now
  }

  onValueChanged(data?: any) {
    if (!this.donorForm) { return; }
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
}
