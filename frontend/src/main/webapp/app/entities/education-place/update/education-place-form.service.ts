import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IEducationPlace, NewEducationPlace } from '../education-place.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IEducationPlace for edit and NewEducationPlaceFormGroupInput for create.
 */
type EducationPlaceFormGroupInput = IEducationPlace | PartialWithRequiredKeyOf<NewEducationPlace>;

type EducationPlaceFormDefaults = Pick<NewEducationPlace, 'id'>;

type EducationPlaceFormGroupContent = {
  id: FormControl<IEducationPlace['id'] | NewEducationPlace['id']>;
  placeName: FormControl<IEducationPlace['placeName']>;
  city: FormControl<IEducationPlace['city']>;
};

export type EducationPlaceFormGroup = FormGroup<EducationPlaceFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class EducationPlaceFormService {
  createEducationPlaceFormGroup(educationPlace: EducationPlaceFormGroupInput = { id: null }): EducationPlaceFormGroup {
    const educationPlaceRawValue = {
      ...this.getFormDefaults(),
      ...educationPlace,
    };
    return new FormGroup<EducationPlaceFormGroupContent>({
      id: new FormControl(
        { value: educationPlaceRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      placeName: new FormControl(educationPlaceRawValue.placeName, {
        validators: [Validators.required],
      }),
      city: new FormControl(educationPlaceRawValue.city),
    });
  }

  getEducationPlace(form: EducationPlaceFormGroup): IEducationPlace | NewEducationPlace {
    return form.getRawValue() as IEducationPlace | NewEducationPlace;
  }

  resetForm(form: EducationPlaceFormGroup, educationPlace: EducationPlaceFormGroupInput): void {
    const educationPlaceRawValue = { ...this.getFormDefaults(), ...educationPlace };
    form.reset(
      {
        ...educationPlaceRawValue,
        id: { value: educationPlaceRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): EducationPlaceFormDefaults {
    return {
      id: null,
    };
  }
}
