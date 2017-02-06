import { Component, OnInit } from '@angular/core';
import { MdDialog } from '@angular/material';
import { UserTypeToggleComponent } from '../user-type-toggle/user-type-toggle.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  constructor(private dialog: MdDialog) {}

  ngOnInit(): void {
    this.openDialog();
  }

  openDialog() {
    this.dialog.open(UserTypeToggleComponent, { disableClose: true });
  }
}
