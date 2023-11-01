import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { IEducationPlace } from 'app/entities/education-place/education-place.model';
import { EducationPlaceService } from 'app/entities/education-place/service/education-place.service';
import { StudentService } from '../service/student.service';
import { IStudent } from '../student.model';
import { StudentFormService } from './student-form.service';

import { StudentUpdateComponent } from './student-update.component';

describe('Student Management Update Component', () => {
  let comp: StudentUpdateComponent;
  let fixture: ComponentFixture<StudentUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let studentFormService: StudentFormService;
  let studentService: StudentService;
  let educationPlaceService: EducationPlaceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), StudentUpdateComponent],
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
      .overrideTemplate(StudentUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(StudentUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    studentFormService = TestBed.inject(StudentFormService);
    studentService = TestBed.inject(StudentService);
    educationPlaceService = TestBed.inject(EducationPlaceService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call EducationPlace query and add missing value', () => {
      const student: IStudent = { id: 456 };
      const educationPlace: IEducationPlace = { id: 29960 };
      student.educationPlace = educationPlace;

      const educationPlaceCollection: IEducationPlace[] = [{ id: 24294 }];
      jest.spyOn(educationPlaceService, 'query').mockReturnValue(of(new HttpResponse({ body: educationPlaceCollection })));
      const additionalEducationPlaces = [educationPlace];
      const expectedCollection: IEducationPlace[] = [...additionalEducationPlaces, ...educationPlaceCollection];
      jest.spyOn(educationPlaceService, 'addEducationPlaceToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ student });
      comp.ngOnInit();

      expect(educationPlaceService.query).toHaveBeenCalled();
      expect(educationPlaceService.addEducationPlaceToCollectionIfMissing).toHaveBeenCalledWith(
        educationPlaceCollection,
        ...additionalEducationPlaces.map(expect.objectContaining),
      );
      expect(comp.educationPlacesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const student: IStudent = { id: 456 };
      const educationPlace: IEducationPlace = { id: 23778 };
      student.educationPlace = educationPlace;

      activatedRoute.data = of({ student });
      comp.ngOnInit();

      expect(comp.educationPlacesSharedCollection).toContain(educationPlace);
      expect(comp.student).toEqual(student);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IStudent>>();
      const student = { id: 123 };
      jest.spyOn(studentFormService, 'getStudent').mockReturnValue(student);
      jest.spyOn(studentService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ student });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: student }));
      saveSubject.complete();

      // THEN
      expect(studentFormService.getStudent).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(studentService.update).toHaveBeenCalledWith(expect.objectContaining(student));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IStudent>>();
      const student = { id: 123 };
      jest.spyOn(studentFormService, 'getStudent').mockReturnValue({ id: null });
      jest.spyOn(studentService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ student: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: student }));
      saveSubject.complete();

      // THEN
      expect(studentFormService.getStudent).toHaveBeenCalled();
      expect(studentService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IStudent>>();
      const student = { id: 123 };
      jest.spyOn(studentService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ student });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(studentService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareEducationPlace', () => {
      it('Should forward to educationPlaceService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(educationPlaceService, 'compareEducationPlace');
        comp.compareEducationPlace(entity, entity2);
        expect(educationPlaceService.compareEducationPlace).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
