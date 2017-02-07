import { Component, OnInit } from '@angular/core';
import { SocketService } from '../shared/socket.service';
import { MdSnackBar } from '@angular/material';
import ModelEvent from '../../models/model-event.model';

@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html'
})
export class PatientComponent implements OnInit {
  constructor(
    private socketService: SocketService,
    public snackBar: MdSnackBar
  ) { }

  onMapEvent(moreDetailsEvent) {
    // TODO: handle this event by showing more info about the donor
    console.log(moreDetailsEvent);
  }

  ngOnInit() {
    this.socketService.get()
      .subscribe((modelEvent: ModelEvent) => {
        const onScreenMessageForEvent = {
          [SocketService.MODEL_CREATE]: `New ${modelEvent.data.bloodGroup} donor registration`,
          [SocketService.MODEL_UPDATE]: `${modelEvent.data.bloodGroup} donor info update`,
          [SocketService.MODEL_DELETE]: `${modelEvent.data.bloodGroup} donor un-registration`,
        };

        this.snackBar.open(onScreenMessageForEvent[modelEvent.action], 'Refresh Map', {
            duration: 3000// ms
          }
        );
      });
  }
}
