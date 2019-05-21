import { Component } from '@angular/core';
import {
  MatDialogRef,
} from '@angular/material';

@Component({
  selector: 'app-add-new-data-modal',
  templateUrl: 'add-new-data-modal.component.html',
})
export class AddNewDataModalComponent {
  // This boolean is sent to the health-list-items-component if the
  // user presses the remove button
  typeApp = 'app';
  typeOwnCategory = 'category';

  constructor(public dialogRef: MatDialogRef<AddNewDataModalComponent>) {}

  closeDialog(): void {
    this.dialogRef.close();
  }
}
