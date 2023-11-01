import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IPractice } from '../practice.model';
import { PracticeService } from '../service/practice.service';

@Component({
  standalone: true,
  templateUrl: './practice-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class PracticeDeleteDialogComponent {
  practice?: IPractice;

  constructor(
    protected practiceService: PracticeService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.practiceService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
