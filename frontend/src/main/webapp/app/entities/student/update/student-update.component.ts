import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IEducationPlace } from 'app/entities/education-place/education-place.model';
import { EducationPlaceService } from 'app/entities/education-place/service/education-place.service';
import { IStudent } from '../student.model';
import { StudentService } from '../service/student.service';
import { StudentFormService, StudentFormGroup } from './student-form.service';

@Component({
  standalone: true,
  selector: 'jhi-student-update',
  templateUrl: './student-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class StudentUpdateComponent implements OnInit {
  isSaving = false;
  student: IStudent | null = null;

  educationPlacesSharedCollection: IEducationPlace[] = [];

  editForm: StudentFormGroup = this.studentFormService.createStudentFormGroup();

  constructor(
    protected studentService: StudentService,
    protected studentFormService: StudentFormService,
    protected educationPlaceService: EducationPlaceService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  compareEducationPlace = (o1: IEducationPlace | null, o2: IEducationPlace | null): boolean =>
    this.educationPlaceService.compareEducationPlace(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ student }) => {
      this.student = student;
      if (student) {
        this.updateForm(student);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const student = this.studentFormService.getStudent(this.editForm);
    if (student.id !== null) {
      this.subscribeToSaveResponse(this.studentService.update(student));
    } else {
      this.subscribeToSaveResponse(this.studentService.create(student));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IStudent>>): void {
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

  protected updateForm(student: IStudent): void {
    this.student = student;
    this.studentFormService.resetForm(this.editForm, student);

    this.educationPlacesSharedCollection = this.educationPlaceService.addEducationPlaceToCollectionIfMissing<IEducationPlace>(
      this.educationPlacesSharedCollection,
      student.educationPlace,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.educationPlaceService
      .query()
      .pipe(map((res: HttpResponse<IEducationPlace[]>) => res.body ?? []))
      .pipe(
        map((educationPlaces: IEducationPlace[]) =>
          this.educationPlaceService.addEducationPlaceToCollectionIfMissing<IEducationPlace>(educationPlaces, this.student?.educationPlace),
        ),
      )
      .subscribe((educationPlaces: IEducationPlace[]) => (this.educationPlacesSharedCollection = educationPlaces));
  }
}
