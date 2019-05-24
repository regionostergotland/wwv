import {Component, Inject} from '@angular/core';
import {MAT_SNACK_BAR_DATA} from '@angular/material';

@Component({
  selector: 'app-snackbar',
  templateUrl: 'error-message-snackbar.component.html',
})
export class ErrorMessageSnackbarComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) { }
}
