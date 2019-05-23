import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-removal-dialog',
  templateUrl: 'data-removal-dialog.component.html',
})
export class DataRemovalDialogComponent {
  // This boolean is sent to the health-list-items-component if the
  // user presses the remove button
  remove = true;

  constructor(public dialogRef: MatDialogRef<DataRemovalDialogComponent>) {}

  closeDialog(): void {
    this.dialogRef.close();
  }
}
