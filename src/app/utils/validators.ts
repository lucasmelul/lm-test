import { AbstractControl, FormGroup } from '@angular/forms';

export class MyValidators {

  static isAgeValid(control: AbstractControl) {
    const value = control.value;
    if (value < 0 || value > 120) {
      return { age_invalid: true };
    }
    return null;
  }

  static  validSelectedCheckboxes({ controlName, min, max } : {controlName: string, min?: number, max?: number}) {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        if(!control.value) return
        const totalSelected = control.value ? control.value.length : 0
        if(min && totalSelected < min) {
          control.setErrors({ minSelected: true });
        }

        if(max && totalSelected > max) {
          control.setErrors({ maxSelected: true });
        }
    }
}

}
