import { Injectable } from '@angular/core';
import { SocketService } from './socket.service';
import ModelEvent from '../../models/model-event.model';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Http } from '@angular/http';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class ModelEventService {
  currentModels: ReplaySubject<any> = new ReplaySubject(1);
  private modelList = [];
  private modelUrl = '/api/model-event';

  constructor(socketService: SocketService, public http: Http) {
    socketService.get().subscribe((modelEvent) => {
      this.updateModelInList(modelEvent);
      this.currentModels.next(this.modelList);
    });

    this.http.get(this.modelUrl).map((response) => response.json())
      .subscribe((modelEvents) => {
        this.modelList = modelEvents;
      });
  }

  private updateModelInList(modelEvent: ModelEvent) {
    const { action, data } = modelEvent;

    if ([SocketService.MODEL_CREATE, SocketService.MODEL_UPDATE].includes(action)) {
      this.updateModelInListOnCreate(data);
    } else if (action === SocketService.MODEL_DELETE) {
      this.updateModelInListOnRemove(data);
    }
  }

  private updateModelInListOnCreate(modelData) {
    const existingModel = this.modelList.find(({ id }) => (id === modelData.id));
    if (!existingModel) {
      // new model
      this.modelList.push(modelData);
    } else {
      // update
      Object.assign(existingModel, modelData);
    }
  }

  private updateModelInListOnRemove(modelData) {
    const currentIndex = this.modelList.findIndex(({ id }) => (id === modelData.id));
    this.modelList.splice(currentIndex, 1);
  }

  // TODO: when needed add this
  // public create(modelData) {
  //   return this.http.post(this.modelUrl, JSON.stringify(modelData))
  //     .map((response) => response.json());
  // }
  //
  // public delete(id) {
  //   return this.http.delete(`${this.modelUrl}/${id}`)
  //     .map((response) => response.json());
  // }
}
