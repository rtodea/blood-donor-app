import { Component } from '@angular/core';
import { MdDialogRef } from '@angular/material';

@Component({
  selector: 'app-donor-deleted',
  templateUrl: './donor-deleted.component.html'
})
export class DonorDeletedComponent {

  constructor(public dialogRef: MdDialogRef<DonorDeletedComponent>) {
  }
}
