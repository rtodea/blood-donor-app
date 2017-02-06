import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { EsriService } from './esri.service';

@Component({
  selector: 'app-esri-map',
  templateUrl: './esri-map.component.html',
  styleUrls: ['./esri-map.component.css']
})
export class EsriMapComponent implements OnInit {
  @ViewChild('map') mapEl: ElementRef;

  mapView: __esri.MapView;
  map: __esri.Map;

  constructor(private esriService: EsriService) { }

  ngOnInit() {
    // only load the ArcGIS API for JavaScript when this component is loaded
    return this.esriService.isLoaded.then(() => {
      this.create();
    });
  }

  private create() {
    this.map = new this.esriService.Map({ basemap: 'streets' });
    this.mapView = new this.esriService.views.MapView({
      container: this.mapEl.nativeElement.id,
      map: this.map,
      zoom: 4,
      center: [15, 65]  // Sets the center point of view in lon/lat
    });

    this.addMapWidgets();
  }

  private addMapWidgets() {
    const searchWidget = new this.esriService.widgets.Search({ view: this.mapView });

    this.mapView.ui.add(searchWidget, {
      position: 'top-left',
      index: 0
    });

    const locateBtn = new this.esriService.widgets.Locate({ view: this.mapView });

    // Add the locate widget to the top left corner of the view
    this.mapView.ui.add(locateBtn, {
      position: 'top-left',
      index: 1
    });
  }
}
