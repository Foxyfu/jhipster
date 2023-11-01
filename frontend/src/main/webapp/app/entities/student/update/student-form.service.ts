import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IStudent, NewStudent } from '../student.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IStudent for edit and NewStudentFormGroupInput for create.
 */
type StudentFormGroupInput = IStudent | PartialWithRequiredKeyOf<NewStudent>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IStudent | NewStudent> = Omit<T, 'studyStart' | 'studyEnd'> & {
  studyStart?: string | null;
  studyEnd?: string | null;
};

type StudentFormRawValue = FormValueOf<IStudent>;

type NewStudentFormRawValue = FormValueOf<NewStudent>;

type StudentFormDefaults = Pick<NewStudent, 'id' | 'studyStart' | 'studyEnd'>;

type StudentFormGroupContent = {
  id: FormControl<StudentFormRawValue['id'] | NewStudent['id']>;
  firstName: FormControl<StudentFormRawValue['firstName']>;
  lastName: FormControl<StudentFormRawValue['lastName']>;
  email: FormControl<StudentFormRawValue['email']>;
  phoneNumber: FormControl<StudentFormRawValue['phoneNumber']>;
  studyStart: FormControl<StudentFormRawValue['studyStart']>;
  studyEnd: FormControl<StudentFormRawValue['studyEnd']>;
  educationPlace: FormControl<StudentFormRawValue['educationPlace']>;
};

export type StudentFormGroup = FormGroup<StudentFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class StudentFormService {
  createStudentFormGroup(student: StudentFormGroupInput = { id: null }): StudentFormGroup {
    const studentRawValue = this.convertStudentToStudentRawValue({
      ...this.getFormDefaults(),
      ...student,
    });
    return new FormGroup<StudentFormGroupContent>({
      id: new FormControl(
        { value: studentRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      firstName: new FormControl(studentRawValue.firstName),
      lastName: new FormControl(studentRawValue.lastName),
      email: new FormControl(studentRawValue.email, {
        validators: [Validators.required],
      }),
      phoneNumber: new FormControl(studentRawValue.phoneNumber),
      studyStart: new FormControl(studentRawValue.studyStart, {
        validators: [Validators.required],
      }),
      studyEnd: new FormControl(studentRawValue.studyEnd),
      educationPlace: new FormControl(studentRawValue.educationPlace),
    });
  }

  getStudent(form: StudentFormGroup): IStudent | NewStudent {
    return this.convertStudentRawValueToStudent(form.getRawValue() as StudentFormRawValue | NewStudentFormRawValue);
  }

  resetForm(form: StudentFormGroup, student: StudentFormGroupInput): void {
    const studentRawValue = this.convertStudentToStudentRawValue({ ...this.getFormDefaults(), ...student });
    form.reset(
      {
        ...studentRawValue,
        id: { value: studentRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): StudentFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      studyStart: currentTime,
      studyEnd: currentTime,
    };
  }

  private convertStudentRawValueToStudent(rawStudent: StudentFormRawValue | NewStudentFormRawValue): IStudent | NewStudent {
    return {
      ...rawStudent,
      studyStart: dayjs(rawStudent.studyStart, DATE_TIME_FORMAT),
      studyEnd: dayjs(rawStudent.studyEnd, DATE_TIME_FORMAT),
    };
  }

  private convertStudentToStudentRawValue(
    student: IStudent | (Partial<NewStudent> & StudentFormDefaults),
  ): StudentFormRawValue | PartialWithRequiredKeyOf<NewStudentFormRawValue> {
    return {
      ...student,
      studyStart: student.studyStart ? student.studyStart.format(DATE_TIME_FORMAT) : undefined,
      studyEnd: student.studyEnd ? student.studyEnd.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
