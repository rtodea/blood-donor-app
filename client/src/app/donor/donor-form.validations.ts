import phone = require('phone'); // Please not this is not compatible with ES6 modules

export function validateEmail(formControl) {
  // from http://emailregex.com/
  /* tslint:disable */
  const EMAIL_REGEXP =/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  /* tslint:enable */

  return EMAIL_REGEXP.test(formControl.value) ? null : { validateEmail: { valid: false } };
}

export function validateContactNumber(formControl) {
  const contactNo = formControl.value;

  return phone(contactNo).length ? null : {validateContactNumber: {valid: false}};
}
