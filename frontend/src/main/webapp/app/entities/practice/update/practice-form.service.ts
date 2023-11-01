import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IPractice, NewPractice } from '../practice.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IPractice for edit and NewPracticeFormGroupInput for create.
 */
type PracticeFormGroupInput = IPractice | PartialWithRequiredKeyOf<NewPractice>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IPractice | NewPractice> = Omit<T, 'startDate' | 'endDate'> & {
  startDate?: string | null;
  endDate?: string | null;
};

type PracticeFormRawValue = FormValueOf<IPractice>;

type NewPracticeFormRawValue = FormValueOf<NewPractice>;

type PracticeFormDefaults = Pick<NewPractice, 'id' | 'startDate' | 'endDate'>;

type PracticeFormGroupContent = {
  id: FormControl<PracticeFormRawValue['id'] | NewPractice['id']>;
  companyName: FormControl<PracticeFormRawValue['companyName']>;
  studentName: FormControl<PracticeFormRawValue['studentName']>;
  startDate: FormControl<PracticeFormRawValue['startDate']>;
  endDate: FormControl<PracticeFormRawValue['endDate']>;
  tasks: FormControl<PracticeFormRawValue['tasks']>;
  student: FormControl<PracticeFormRawValue['student']>;
  company: FormControl<PracticeFormRawValue['company']>;
};

export type PracticeFormGroup = FormGroup<PracticeFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class PracticeFormService {
  createPracticeFormGroup(practice: PracticeFormGroupInput = { id: null }): PracticeFormGroup {
    const practiceRawValue = this.convertPracticeToPracticeRawValue({
      ...this.getFormDefaults(),
      ...practice,
    });
    return new FormGroup<PracticeFormGroupContent>({
      id: new FormControl(
        { value: practiceRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      companyName: new FormControl(practiceRawValue.companyName, {
        validators: [Validators.required],
      }),
      studentName: new FormControl(practiceRawValue.studentName),
      startDate: new FormControl(practiceRawValue.startDate, {
        validators: [Validators.required],
      }),
      endDate: new FormControl(practiceRawValue.endDate),
      tasks: new FormControl(practiceRawValue.tasks),
      student: new FormControl(practiceRawValue.student),
      company: new FormControl(practiceRawValue.company),
    });
  }

  getPractice(form: PracticeFormGroup): IPractice | NewPractice {
    return this.convertPracticeRawValueToPractice(form.getRawValue() as PracticeFormRawValue | NewPracticeFormRawValue);
  }

  resetForm(form: PracticeFormGroup, practice: PracticeFormGroupInput): void {
    const practiceRawValue = this.convertPracticeToPracticeRawValue({ ...this.getFormDefaults(), ...practice });
    form.reset(
      {
        ...practiceRawValue,
        id: { value: practiceRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): PracticeFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      startDate: currentTime,
      endDate: currentTime,
    };
  }

  private convertPracticeRawValueToPractice(rawPractice: PracticeFormRawValue | NewPracticeFormRawValue): IPractice | NewPractice {
    return {
      ...rawPractice,
      startDate: dayjs(rawPractice.startDate, DATE_TIME_FORMAT),
      endDate: dayjs(rawPractice.endDate, DATE_TIME_FORMAT),
    };
  }

  private convertPracticeToPracticeRawValue(
    practice: IPractice | (Partial<NewPractice> & PracticeFormDefaults),
  ): PracticeFormRawValue | PartialWithRequiredKeyOf<NewPracticeFormRawValue> {
    return {
      ...practice,
      startDate: practice.startDate ? practice.startDate.format(DATE_TIME_FORMAT) : undefined,
      endDate: practice.endDate ? practice.endDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
