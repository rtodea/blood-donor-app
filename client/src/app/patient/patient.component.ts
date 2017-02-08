import { Component, OnInit, EventEmitter, ViewChild } from '@angular/core';
import { SocketService } from '../shared/socket.service';
import { MdSnackBar, MdDialog } from '@angular/material';
import ModelEvent from '../../models/model-event.model';
import { DonorViewComponent } from '../donor-view.component/donor-view.component';
import { EsriMapComponent } from '../esri-map/esri-map.component';

@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html'
})
export class PatientComponent implements OnInit {
  donorViewComponent;

  @ViewChild(EsriMapComponent)
  private esriMapComponent: EsriMapComponent;

  constructor(
    private socketService: SocketService,
    public snackBar: MdSnackBar,
    private dialog: MdDialog
  ) { }

  onMapEvent(event) {
    if (event.eventType === 'details') {
      this.openFullDetailsDialog(event.data);
    }
  }

  openFullDetailsDialog(donorDetails) {
    const dialogRef = this.dialog.open(DonorViewComponent);
    this.donorViewComponent = dialogRef.componentInstance;
    this.donorViewComponent.donor = donorDetails;
    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
    });
  }

  ngOnInit() {
    this.socketService.get()
      .subscribe((modelEvent: ModelEvent) => {
        this.maybeReload(modelEvent);
        this.showSnackBar(modelEvent);
      });
  }

  maybeReload(modelEvent) {
    if (modelEvent.action === SocketService.MODEL_CREATE ||
        modelEvent.action === SocketService.MODEL_DELETE) {
      this.esriMapComponent.reload();
    }
  }

  showSnackBar(modelEvent: ModelEvent) {
    const onScreenMessageForEvent = {
      [SocketService.MODEL_CREATE]: `New ${modelEvent.data.bloodGroup} donor registration`,
      [SocketService.MODEL_UPDATE]: `${modelEvent.data.bloodGroup} donor info update`,
      [SocketService.MODEL_DELETE]: `${modelEvent.data.bloodGroup} donor un-registration`,
    };

    const snackBarRef = this.snackBar.open(onScreenMessageForEvent[modelEvent.action], 'Refresh Map', {
        duration: 3000// ms
      }
    );
    snackBarRef.onAction().subscribe(() => {
      console.log('The snack-bar action was triggered!');
      this.esriMapComponent.reload();
    });
  }
}
