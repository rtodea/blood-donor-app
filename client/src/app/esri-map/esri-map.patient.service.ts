import { Injectable } from '@angular/core';
import { EsriMapComponent } from './esri-map.component';
import { AbstractMapService } from './esri-map.abstract.service';

@Injectable()
export class PatientMapService extends AbstractMapService {

  setup(mapComponent: EsriMapComponent) {
    mapComponent.map = new mapComponent.esriService.Map({basemap: 'streets'});

    this.addCSVFeatureLayer(mapComponent);

    this.addMapView(mapComponent);

    this.initReverseLocator(mapComponent);
    this.addMapWidgets(mapComponent);
    this.addDetailsPopupAction(mapComponent);
  }

  // TODO: this does not work for some unknown reason...
  addFeatureLayer(mapComponent: EsriMapComponent) {
    const renderer = new mapComponent.esriService.renderers.SimpleRenderer({
      symbol: new mapComponent.esriService.symbols.SimpleMarkerSymbol({
        style: 'circle',
        size: '20px',
        color: '#673ab7',
        outline: { // autocasts as new SimpleLineSymbol()
          color: [255, 64, 0, 0.4], // autocasts as new Color()
          width: 7
        }
      })
    });

    const layer = new mapComponent.esriService.layers.FeatureLayer({
      source: [
        {
          geometry: new mapComponent.esriService.geometry.Point({
            x: 2719864.8299347507,
            y: 6058490.576041063}),
          attributes: {
            ObjectId: 0
          }
        }
      ],
      fields: [
        {
          name: 'ObjectID',
          alias: 'ObjectID',
          type: 'oid'
        }
      ],
      objectIdField: 'ObjectID',
      spatialReference: {
        wkid: 4326
      },
      geometryType: 'point',
      renderer,
    });

  mapComponent.map.add(layer);
}

  createPopupTemplate() {
    return {
      title: '{bloodGroup} Donor',
      content: [{
        type: 'fields',
        fieldInfos: [{
          fieldName: 'firstName',
          label: 'First Name',
          visible: true
        }, {
          fieldName: 'lastName',
          label: 'Last Name',
          visible: true
        }, {
          fieldName: 'city',
          label: 'City',
          visible: true,
        }]
      }]
    };
  }

  createCSVFeatureLayer(mapComponent) {
    const csvLayer = new mapComponent.esriService.layers.CSVLayer({
      url: '/api/map/0/0/0.csv',
      popupTemplate: this.createPopupTemplate(),
      title: 'Donors'
    });

    csvLayer.renderer = new mapComponent.esriService.renderers.SimpleRenderer({
      symbol: new mapComponent.esriService.symbols.SimpleMarkerSymbol({
        size: '23px',
        color: [238, 69, 0, 0.5],
        outline: {
          width: 0.5,
          color: 'white'
        }
      })
    });

    return csvLayer;
  }

  // TODO: backup because the dynamic one above does not work
  addCSVFeatureLayer(mapComponent: EsriMapComponent) {
    mapComponent.map.add(this.createCSVFeatureLayer(mapComponent));
  }

  initReverseLocator(mapComponent: EsriMapComponent) {
    mapComponent.locator = new mapComponent.esriService.tasks.Locator({
      url: 'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer'
    });
  }

  addMapWidgets(mapComponent: EsriMapComponent) {
    const searchWidget = new mapComponent.esriService.widgets.Search({view: mapComponent.mapView});

    mapComponent.mapView.ui.add(searchWidget, {
      position: 'top-left',
      index: 0
    });

    const locateBtn = new mapComponent.esriService.widgets.Locate({view: mapComponent.mapView});

    // Add the locate widget to the top left corner of the view
    mapComponent.mapView.ui.add(locateBtn, {
      position: 'top-left',
      index: 1
    });
  }

  addDetailsPopupAction(mapComponent: EsriMapComponent) {
    const moreDetailsAction = {
      // This text is displayed as a tool tip
      title: 'View Contact Info',
      id: 'details',
      className: 'esri-icon-locked'
    };

    const popup = mapComponent.mapView.popup;
    // Adds the action to the view's default popup.
    popup.actions.push(moreDetailsAction);

    // event handler that fires each time an action is clicked
    popup.on('trigger-action', (event) => {
      /* If the zoom-out action is clicked, the following code executes  */
      if (event.action.id === 'details') {
        const attributes = popup.viewModel.selectedFeature.attributes;
        mapComponent.onMapEvent.emit(
          {
            eventType: event.action.id,
            data: attributes
          }
        );
      }
    });
  }

  reload(mapComponent: EsriMapComponent) {
    // TODO: find a better approach
    // switch old layers with the new one
    const layer = this.createCSVFeatureLayer(mapComponent);
    layer.load().then(() => {
      mapComponent.map.add(layer);
      mapComponent.map.layers.removeAt(0);
    });
  }
}
