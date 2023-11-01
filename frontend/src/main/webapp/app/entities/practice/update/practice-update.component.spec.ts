import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { IStudent } from 'app/entities/student/student.model';
import { StudentService } from 'app/entities/student/service/student.service';
import { ICompany } from 'app/entities/company/company.model';
import { CompanyService } from 'app/entities/company/service/company.service';
import { IPractice } from '../practice.model';
import { PracticeService } from '../service/practice.service';
import { PracticeFormService } from './practice-form.service';

import { PracticeUpdateComponent } from './practice-update.component';

describe('Practice Management Update Component', () => {
  let comp: PracticeUpdateComponent;
  let fixture: ComponentFixture<PracticeUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let practiceFormService: PracticeFormService;
  let practiceService: PracticeService;
  let studentService: StudentService;
  let companyService: CompanyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), PracticeUpdateComponent],
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
      .overrideTemplate(PracticeUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PracticeUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    practiceFormService = TestBed.inject(PracticeFormService);
    practiceService = TestBed.inject(PracticeService);
    studentService = TestBed.inject(StudentService);
    companyService = TestBed.inject(CompanyService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Student query and add missing value', () => {
      const practice: IPractice = { id: 456 };
      const student: IStudent = { id: 12319 };
      practice.student = student;

      const studentCollection: IStudent[] = [{ id: 27388 }];
      jest.spyOn(studentService, 'query').mockReturnValue(of(new HttpResponse({ body: studentCollection })));
      const additionalStudents = [student];
      const expectedCollection: IStudent[] = [...additionalStudents, ...studentCollection];
      jest.spyOn(studentService, 'addStudentToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ practice });
      comp.ngOnInit();

      expect(studentService.query).toHaveBeenCalled();
      expect(studentService.addStudentToCollectionIfMissing).toHaveBeenCalledWith(
        studentCollection,
        ...additionalStudents.map(expect.objectContaining),
      );
      expect(comp.studentsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Company query and add missing value', () => {
      const practice: IPractice = { id: 456 };
      const company: ICompany = { id: 18864 };
      practice.company = company;

      const companyCollection: ICompany[] = [{ id: 21948 }];
      jest.spyOn(companyService, 'query').mockReturnValue(of(new HttpResponse({ body: companyCollection })));
      const additionalCompanies = [company];
      const expectedCollection: ICompany[] = [...additionalCompanies, ...companyCollection];
      jest.spyOn(companyService, 'addCompanyToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ practice });
      comp.ngOnInit();

      expect(companyService.query).toHaveBeenCalled();
      expect(companyService.addCompanyToCollectionIfMissing).toHaveBeenCalledWith(
        companyCollection,
        ...additionalCompanies.map(expect.objectContaining),
      );
      expect(comp.companiesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const practice: IPractice = { id: 456 };
      const student: IStudent = { id: 32176 };
      practice.student = student;
      const company: ICompany = { id: 5282 };
      practice.company = company;

      activatedRoute.data = of({ practice });
      comp.ngOnInit();

      expect(comp.studentsSharedCollection).toContain(student);
      expect(comp.companiesSharedCollection).toContain(company);
      expect(comp.practice).toEqual(practice);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPractice>>();
      const practice = { id: 123 };
      jest.spyOn(practiceFormService, 'getPractice').mockReturnValue(practice);
      jest.spyOn(practiceService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ practice });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: practice }));
      saveSubject.complete();

      // THEN
      expect(practiceFormService.getPractice).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(practiceService.update).toHaveBeenCalledWith(expect.objectContaining(practice));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPractice>>();
      const practice = { id: 123 };
      jest.spyOn(practiceFormService, 'getPractice').mockReturnValue({ id: null });
      jest.spyOn(practiceService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ practice: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: practice }));
      saveSubject.complete();

      // THEN
      expect(practiceFormService.getPractice).toHaveBeenCalled();
      expect(practiceService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPractice>>();
      const practice = { id: 123 };
      jest.spyOn(practiceService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ practice });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(practiceService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareStudent', () => {
      it('Should forward to studentService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(studentService, 'compareStudent');
        comp.compareStudent(entity, entity2);
        expect(studentService.compareStudent).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareCompany', () => {
      it('Should forward to companyService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(companyService, 'compareCompany');
        comp.compareCompany(entity, entity2);
        expect(companyService.compareCompany).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
