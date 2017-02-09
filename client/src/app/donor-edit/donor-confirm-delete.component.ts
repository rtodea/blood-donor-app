import { Component } from '@angular/core';
import { MdDialogRef } from '@angular/material';

@Component({
  selector: 'app-donor-confirm-delete',
  templateUrl: './donor-confirm-delete.component.html'
})
export class DonorConfirmDeleteComponent {

  constructor(public dialogRef: MdDialogRef<DonorConfirmDeleteComponent>) {
  }
}
