import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RegisterDonorComponent } from '../register-donor/register-donor.component';
import { MdDialog } from '@angular/material';

@Component({
  selector: 'app-donor',
  templateUrl: './donor.component.html'
})
export class DonorComponent implements OnInit {
  currentDonor;

  constructor(private activatedRoute: ActivatedRoute, private dialog: MdDialog) {}

  ngOnInit() {
    this.activatedRoute.params
      .subscribe((params) => {
        this.currentDonor = params['id'];
      });
  }

  onMapEvent(eventData) {
    console.log(eventData);
    if (eventData.eventType === 'register') {
      this.openDialog(eventData);
    }
  }

  openDialog(eventData) {
    const dialogRef = this.dialog.open(RegisterDonorComponent, { disableClose: true });
    dialogRef.componentInstance.locationData = {
      address: eventData.address,
      latitude: eventData.mapPoint.latitude,
      longitude: eventData.mapPoint.longitude
    };

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
    });
  }
}
