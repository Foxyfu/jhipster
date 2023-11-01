import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IStudent } from 'app/entities/student/student.model';
import { StudentService } from 'app/entities/student/service/student.service';
import { ICompany } from 'app/entities/company/company.model';
import { CompanyService } from 'app/entities/company/service/company.service';
import { PracticeService } from '../service/practice.service';
import { IPractice } from '../practice.model';
import { PracticeFormService, PracticeFormGroup } from './practice-form.service';

@Component({
  standalone: true,
  selector: 'jhi-practice-update',
  templateUrl: './practice-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class PracticeUpdateComponent implements OnInit {
  isSaving = false;
  practice: IPractice | null = null;

  studentsSharedCollection: IStudent[] = [];
  companiesSharedCollection: ICompany[] = [];

  editForm: PracticeFormGroup = this.practiceFormService.createPracticeFormGroup();

  constructor(
    protected practiceService: PracticeService,
    protected practiceFormService: PracticeFormService,
    protected studentService: StudentService,
    protected companyService: CompanyService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  compareStudent = (o1: IStudent | null, o2: IStudent | null): boolean => this.studentService.compareStudent(o1, o2);

  compareCompany = (o1: ICompany | null, o2: ICompany | null): boolean => this.companyService.compareCompany(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ practice }) => {
      this.practice = practice;
      if (practice) {
        this.updateForm(practice);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const practice = this.practiceFormService.getPractice(this.editForm);
    if (practice.id !== null) {
      this.subscribeToSaveResponse(this.practiceService.update(practice));
    } else {
      this.subscribeToSaveResponse(this.practiceService.create(practice));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPractice>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(practice: IPractice): void {
    this.practice = practice;
    this.practiceFormService.resetForm(this.editForm, practice);

    this.studentsSharedCollection = this.studentService.addStudentToCollectionIfMissing<IStudent>(
      this.studentsSharedCollection,
      practice.student,
    );
    this.companiesSharedCollection = this.companyService.addCompanyToCollectionIfMissing<ICompany>(
      this.companiesSharedCollection,
      practice.company,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.studentService
      .query()
      .pipe(map((res: HttpResponse<IStudent[]>) => res.body ?? []))
      .pipe(map((students: IStudent[]) => this.studentService.addStudentToCollectionIfMissing<IStudent>(students, this.practice?.student)))
      .subscribe((students: IStudent[]) => (this.studentsSharedCollection = students));

    this.companyService
      .query()
      .pipe(map((res: HttpResponse<ICompany[]>) => res.body ?? []))
      .pipe(
        map((companies: ICompany[]) => this.companyService.addCompanyToCollectionIfMissing<ICompany>(companies, this.practice?.company)),
      )
      .subscribe((companies: ICompany[]) => (this.companiesSharedCollection = companies));
  }
}
