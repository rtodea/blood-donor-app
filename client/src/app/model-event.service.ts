import { Injectable } from '@angular/core';
import { SocketService } from './socket.service';
import ModelEvent from '../models/model-event.model';
import { ReplaySubject } from 'rxjs/ReplaySubject';

@Injectable()
export class ModelEventService {
  currentModels: ReplaySubject<any> = new ReplaySubject(1);
  private modelList = [];

  constructor(
    private socketService: SocketService
  ) {
    this.socketService.get().subscribe((modelEvent) => {
      this.updateModelInList(modelEvent);
      this.currentModels.next(this.modelList);
    });
  }

  private updateModelInList(modelEvent: ModelEvent) {
    const { action, data } = modelEvent;

    if (action === SocketService.MODEL_CREATE) {
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
}
