import * as validations from '../../../src/app/donor/donor-form.validations';

describe('Custom Form Validations', () => {
  describe('email', () => {

    const sut = validations.validateEmail;
    it('should show no errors for a correct email', () => {
      expect(sut({value: 'john.doe@acme.com'})).toBeNull();
    });

    it('should show errors for an incorrect email', () => {
      expect(sut({value: 'john.doecme.com'})).toEqual({
        validateEmail: { valid: false }
      });
    });
  });

  describe('phone number', () => {
    const sut = validations.validateContactNumber;

    it('should show no errors for a correct phone no', () => {
      expect(sut({value: '+1(817) 569-8900'})).toBeNull();
    });

    it('should work on different spacing in phone no', () => {
      expect(sut({value: '(817) 569-8900'})).toBeNull();
    });

    it('should show errors for an incorrect phone', () => {
      expect(sut({value: '00123455663'})).toEqual({
        validateContactNumber: { valid: false }
      });
    });
  });
});
