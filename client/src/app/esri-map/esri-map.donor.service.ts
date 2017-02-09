import { Injectable } from '@angular/core';
import { EsriMapComponent } from './esri-map.component';
import { EsriService } from './esri.service';
import { AbstractMapService } from './esri-map.abstract.service';

@Injectable()
export class DonorMapService extends AbstractMapService {

  setup(mapComponent: EsriMapComponent) {
    mapComponent.map = new mapComponent.esriService.Map({basemap: 'streets'});

    this.addMapView(mapComponent);

    this.addLocator(mapComponent);
    this.addMapWidgets(mapComponent);
    this.addLocatePopupTemplate(mapComponent);
  }

  addLocator(mapComponent: EsriMapComponent) {
    mapComponent.locator = new mapComponent.esriService.tasks.Locator({
      url: 'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer'
    });
  }

  addLocatePopupTemplate(mapComponent: EsriMapComponent) {
    const locationDetails = { mapPoint: null, address: null };

    mapComponent.mapView.on('click', ({mapPoint}) => {
      mapComponent.locator.locationToAddress(mapPoint)
        .then((response) => {
          mapComponent.mapView.popup.open({
            title: 'Set current location',
            location: mapPoint,
            content: response.address.Match_addr
          });
          // mapComponent.onMapEvent.emit({eventType: 'click', address: response.address, mapPoint});
          locationDetails.mapPoint = mapPoint;
          locationDetails.address = response.address;
        })
        .otherwise(() => {
          mapComponent.mapView.popup.open({
            title: `Set current location to [Lon: ${mapPoint.longitude}, Lat: ${mapPoint.latitude}]`,
            location: mapPoint,
            content: 'No address was found for this location'
          });
          locationDetails.mapPoint = mapPoint;
          locationDetails.address = null;
          // mapComponent.onMapEvent.emit({eventType: 'click', mapPoint});
        });
    });

    const registerAction = {
      // This text is displayed as a tool tip
      title: 'Register',
      id: 'register',
      className: 'esri-icon-authorize'
    };

    // Adds the action to the view's default popup.
    mapComponent.mapView.popup.actions.push(registerAction);

    // event handler that fires each time an action is clicked
    mapComponent.mapView.popup.on('trigger-action', (event) => {
      /* If the zoom-out action is clicked, the following code executes  */
      if (event.action.id === 'register') {
        mapComponent.onMapEvent.emit({eventType: event.action.id, mapPoint: locationDetails.mapPoint, address: locationDetails.address });
      }
    });
  }
}
