import phone = require('phone'); // Please not this is not compatible with ES6 modules
import { FormControl } from '@angular/forms';

export function validateEmail(c: FormControl) {
  // from http://emailregex.com/
  /* tslint:disable */
  const EMAIL_REGEXP =/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  /* tslint:enable */

  return EMAIL_REGEXP.test(c.value) ? null : { validateEmail: { valid: false } };
}

export function validateContactNumber(c: FormControl) {
  const contactNo = c.value;

  return phone(contactNo).length ? null : {validateContactNumber: {valid: false}};
}
