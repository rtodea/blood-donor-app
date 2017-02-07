import { Component } from '@angular/core';
import { MdDialog } from '@angular/material';
import { DonorRegisterComponent } from '../donor-register/donor-register.component';

@Component({
  selector: 'app-donor',
  templateUrl: './donor.component.html'
})
export class DonorComponent {
  constructor(private dialog: MdDialog) {}

  onMapEvent(eventData) {
    if (eventData.eventType === 'register') {
      this.openDialog(eventData);
    }
  }

  openDialog(eventData) {
    const dialogRef = this.dialog.open(DonorRegisterComponent, { disableClose: true });
    const locatedData = eventData.address || {};
    Object.assign(dialogRef.componentInstance.donor, {
      street: locatedData.Address,
      city: locatedData.City,
      countryCode: locatedData.CountryCode,
      latitude: eventData.mapPoint.latitude,
      longitude: eventData.mapPoint.longitude
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
    });
  }
}
