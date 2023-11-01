import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../education-place.test-samples';

import { EducationPlaceFormService } from './education-place-form.service';

describe('EducationPlace Form Service', () => {
  let service: EducationPlaceFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EducationPlaceFormService);
  });

  describe('Service methods', () => {
    describe('createEducationPlaceFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createEducationPlaceFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            placeName: expect.any(Object),
            city: expect.any(Object),
          }),
        );
      });

      it('passing IEducationPlace should create a new form with FormGroup', () => {
        const formGroup = service.createEducationPlaceFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            placeName: expect.any(Object),
            city: expect.any(Object),
          }),
        );
      });
    });

    describe('getEducationPlace', () => {
      it('should return NewEducationPlace for default EducationPlace initial value', () => {
        const formGroup = service.createEducationPlaceFormGroup(sampleWithNewData);

        const educationPlace = service.getEducationPlace(formGroup) as any;

        expect(educationPlace).toMatchObject(sampleWithNewData);
      });

      it('should return NewEducationPlace for empty EducationPlace initial value', () => {
        const formGroup = service.createEducationPlaceFormGroup();

        const educationPlace = service.getEducationPlace(formGroup) as any;

        expect(educationPlace).toMatchObject({});
      });

      it('should return IEducationPlace', () => {
        const formGroup = service.createEducationPlaceFormGroup(sampleWithRequiredData);

        const educationPlace = service.getEducationPlace(formGroup) as any;

        expect(educationPlace).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IEducationPlace should not enable id FormControl', () => {
        const formGroup = service.createEducationPlaceFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewEducationPlace should disable id FormControl', () => {
        const formGroup = service.createEducationPlaceFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
