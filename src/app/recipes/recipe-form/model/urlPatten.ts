import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function urlValidator(): ValidatorFn {
    const urlPattern = /^(https?:\/\/)?([a-z0-9]+(\.[a-z0-9]+)+)(\/[a-z0-9\-._~:/?#[\]@!$&'()*+,;=]*)?$/i;
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value && !urlPattern.test(control.value)) {
        return { invalidUrl: 'Ссылка на изображение некорректна' };
      }
      return null;
    };
  }