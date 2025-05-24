import { AbstractControl, ValidationErrors } from '@angular/forms';

export function IbanValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value?.replace(/\s+/g, '').toUpperCase();
  if (!value) return null;

  const ibanRegex = /^[A-Z]{2}[0-9]{2}[A-Z]{4}[0-9]{1,30}$/;
  if (!ibanRegex.test(value)) {
    return { invalidIban: true };
  }

  return null;
}
