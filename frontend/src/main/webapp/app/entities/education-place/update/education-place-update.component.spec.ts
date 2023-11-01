import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { EducationPlaceService } from '../service/education-place.service';
import { IEducationPlace } from '../education-place.model';
import { EducationPlaceFormService } from './education-place-form.service';

import { EducationPlaceUpdateComponent } from './education-place-update.component';

describe('EducationPlace Management Update Component', () => {
  let comp: EducationPlaceUpdateComponent;
  let fixture: ComponentFixture<EducationPlaceUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let educationPlaceFormService: EducationPlaceFormService;
  let educationPlaceService: EducationPlaceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), EducationPlaceUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(EducationPlaceUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EducationPlaceUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    educationPlaceFormService = TestBed.inject(EducationPlaceFormService);
    educationPlaceService = TestBed.inject(EducationPlaceService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const educationPlace: IEducationPlace = { id: 456 };

      activatedRoute.data = of({ educationPlace });
      comp.ngOnInit();

      expect(comp.educationPlace).toEqual(educationPlace);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEducationPlace>>();
      const educationPlace = { id: 123 };
      jest.spyOn(educationPlaceFormService, 'getEducationPlace').mockReturnValue(educationPlace);
      jest.spyOn(educationPlaceService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ educationPlace });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: educationPlace }));
      saveSubject.complete();

      // THEN
      expect(educationPlaceFormService.getEducationPlace).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(educationPlaceService.update).toHaveBeenCalledWith(expect.objectContaining(educationPlace));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEducationPlace>>();
      const educationPlace = { id: 123 };
      jest.spyOn(educationPlaceFormService, 'getEducationPlace').mockReturnValue({ id: null });
      jest.spyOn(educationPlaceService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ educationPlace: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: educationPlace }));
      saveSubject.complete();

      // THEN
      expect(educationPlaceFormService.getEducationPlace).toHaveBeenCalled();
      expect(educationPlaceService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEducationPlace>>();
      const educationPlace = { id: 123 };
      jest.spyOn(educationPlaceService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ educationPlace });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(educationPlaceService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
