import { Component, OnInit } from '@angular/core';

import { ModelEventService } from './shared/model-event.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  currentModels;
  title = 'Blood Donors App';
  selectedModel: any = {};

  constructor(public modelEventService: ModelEventService) {}

  ngOnInit(): void {
    this.modelEventService.currentModels.subscribe((modelList) => {
      this.currentModels = modelList;
    });
  }

  showModelInfo(modelEvent): void {
    this.selectedModel = modelEvent;
  }
}
