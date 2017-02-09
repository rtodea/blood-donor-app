import { Component } from '@angular/core';
import { MdDialogRef } from '@angular/material';

@Component({
  selector: 'app-donor-updated',
  templateUrl: './donor-updated.component.html'
})
export class DonorUpdatedComponent {

  constructor(public dialogRef: MdDialogRef<DonorUpdatedComponent>) {
  }
}
