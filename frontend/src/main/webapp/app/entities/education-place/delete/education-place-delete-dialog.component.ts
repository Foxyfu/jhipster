import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IEducationPlace } from '../education-place.model';
import { EducationPlaceService } from '../service/education-place.service';

@Component({
  standalone: true,
  templateUrl: './education-place-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class EducationPlaceDeleteDialogComponent {
  educationPlace?: IEducationPlace;

  constructor(
    protected educationPlaceService: EducationPlaceService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.educationPlaceService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
