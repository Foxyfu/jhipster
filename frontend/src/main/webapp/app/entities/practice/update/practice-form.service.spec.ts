import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../practice.test-samples';

import { PracticeFormService } from './practice-form.service';

describe('Practice Form Service', () => {
  let service: PracticeFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PracticeFormService);
  });

  describe('Service methods', () => {
    describe('createPracticeFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createPracticeFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            companyName: expect.any(Object),
            studentName: expect.any(Object),
            startDate: expect.any(Object),
            endDate: expect.any(Object),
            tasks: expect.any(Object),
            student: expect.any(Object),
            company: expect.any(Object),
          }),
        );
      });

      it('passing IPractice should create a new form with FormGroup', () => {
        const formGroup = service.createPracticeFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            companyName: expect.any(Object),
            studentName: expect.any(Object),
            startDate: expect.any(Object),
            endDate: expect.any(Object),
            tasks: expect.any(Object),
            student: expect.any(Object),
            company: expect.any(Object),
          }),
        );
      });
    });

    describe('getPractice', () => {
      it('should return NewPractice for default Practice initial value', () => {
        const formGroup = service.createPracticeFormGroup(sampleWithNewData);

        const practice = service.getPractice(formGroup) as any;

        expect(practice).toMatchObject(sampleWithNewData);
      });

      it('should return NewPractice for empty Practice initial value', () => {
        const formGroup = service.createPracticeFormGroup();

        const practice = service.getPractice(formGroup) as any;

        expect(practice).toMatchObject({});
      });

      it('should return IPractice', () => {
        const formGroup = service.createPracticeFormGroup(sampleWithRequiredData);

        const practice = service.getPractice(formGroup) as any;

        expect(practice).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IPractice should not enable id FormControl', () => {
        const formGroup = service.createPracticeFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewPractice should disable id FormControl', () => {
        const formGroup = service.createPracticeFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
