import { Component } from '@angular/core';
import { MdDialogRef } from '@angular/material';

@Component({
  selector: 'app-donor-view',
  templateUrl: './donor-view.component.html'
})
export class DonorViewComponent {
  donor;

  constructor(public dialogRef: MdDialogRef<DonorViewComponent>) {
  }
}
