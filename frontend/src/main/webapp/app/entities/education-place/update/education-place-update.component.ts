import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IEducationPlace } from '../education-place.model';
import { EducationPlaceService } from '../service/education-place.service';
import { EducationPlaceFormService, EducationPlaceFormGroup } from './education-place-form.service';

@Component({
  standalone: true,
  selector: 'jhi-education-place-update',
  templateUrl: './education-place-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class EducationPlaceUpdateComponent implements OnInit {
  isSaving = false;
  educationPlace: IEducationPlace | null = null;

  editForm: EducationPlaceFormGroup = this.educationPlaceFormService.createEducationPlaceFormGroup();

  constructor(
    protected educationPlaceService: EducationPlaceService,
    protected educationPlaceFormService: EducationPlaceFormService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ educationPlace }) => {
      this.educationPlace = educationPlace;
      if (educationPlace) {
        this.updateForm(educationPlace);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const educationPlace = this.educationPlaceFormService.getEducationPlace(this.editForm);
    if (educationPlace.id !== null) {
      this.subscribeToSaveResponse(this.educationPlaceService.update(educationPlace));
    } else {
      this.subscribeToSaveResponse(this.educationPlaceService.create(educationPlace));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEducationPlace>>): void {
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

  protected updateForm(educationPlace: IEducationPlace): void {
    this.educationPlace = educationPlace;
    this.educationPlaceFormService.resetForm(this.editForm, educationPlace);
  }
}
