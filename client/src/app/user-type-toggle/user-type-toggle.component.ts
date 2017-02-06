import { Component } from '@angular/core';
import { MdDialogRef } from '@angular/material';

@Component({
  selector: 'app-user-type-toggle',
  templateUrl: './user-type-toggle.component.html'
})
export class UserTypeToggleComponent {

  constructor(public dialogRef: MdDialogRef<UserTypeToggleComponent>) {
  }
}
