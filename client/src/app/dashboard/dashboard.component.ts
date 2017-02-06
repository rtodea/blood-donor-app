import { Component, OnInit } from '@angular/core';
import { MdDialog } from '@angular/material';
import { RegisterDonorComponent } from '../register-donor/register-donor.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  constructor(public dialog: MdDialog) {}

  ngOnInit(): void {
    this.openDialog();
  }

  openDialog() {
    this.dialog.open(RegisterDonorComponent);
  }
}
