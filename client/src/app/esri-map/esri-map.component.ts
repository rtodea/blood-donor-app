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
  locator: __esri.Locator;

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

    this.initReverseLocator();
    this.addMapWidgets();
    this.registerClickHandler();
  }

  private initReverseLocator() {
    this.locator = new this.esriService.tasks.Locator({
      url: 'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer'
    });
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

  registerClickHandler() {
    this.mapView.on('click', (event) => {
      // Get the coordinates of the click on the view
      // around the decimals to 3 decimals
      const lat = Math.round(event.mapPoint.latitude * 1000) / 1000;
      const lon = Math.round(event.mapPoint.longitude * 1000) / 1000;

      this.mapView.popup.content = '';
      this.mapView.popup.open({
        // Set the popup's title to the coordinates of the clicked location
        title: `You will be registered at this location: [${lon}, ${lat}]`,
        location: event.mapPoint // Set the location of the popup to the clicked location
      });
      this.locator.locationToAddress(event.mapPoint)
        .then((response) => {
          this.mapView.popup.content = response.address.Match_addr;
        })
        .otherwise(() => {
          this.mapView.popup.content = 'No address was found for this location';
        });
    });
  }
}
