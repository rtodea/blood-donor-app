import { Component, OnInit, EventEmitter, ViewChild, ElementRef, Output, Input } from '@angular/core';

import { EsriService } from './esri.service';

@Component({
  selector: 'app-esri-map',
  templateUrl: './esri-map.component.html',
  styleUrls: ['./esri-map.component.css']
})
export class EsriMapComponent implements OnInit {
  @ViewChild('map') mapEl: ElementRef;

  @Input() userType: string;
  @Input() goTo;
  @Output() onMapEvent = new EventEmitter<any>();

  mapView: __esri.MapView;
  map: __esri.Map;
  locator: __esri.Locator;

  mapCreatorForUserType = {
    patient: createPatientMap,
    donor: createDonorMap
  };

  constructor(public esriService: EsriService) {
  }

  ngOnInit() {
    // only load the ArcGIS API for JavaScript when this component is loaded
    return this.esriService.isLoaded.then(() => {
      this.mapCreatorForUserType[this.userType](this);
    });
  }
}

function createMapView(mapComponent: EsriMapComponent) {
  const INITIAL_ZOOM = 4;
  const CENTER_LONGITUDE = 22;
  const CENTER_LATITUDE = 22;

  const zoom =  (mapComponent.goTo || {}).zoom || INITIAL_ZOOM;
  const center = [
    (mapComponent.goTo || {}).longitude || CENTER_LONGITUDE,
    (mapComponent.goTo || {}).latitude || CENTER_LATITUDE
  ];

  mapComponent.mapView = new mapComponent.esriService.views.MapView({
    container: mapComponent.mapEl.nativeElement.id,
    map: mapComponent.map,
    zoom,
    center,
  });
}

function createDonorMap(mapComponent: EsriMapComponent) {
  mapComponent.map = new mapComponent.esriService.Map({basemap: 'streets'});

  createMapView(mapComponent);

  initReverseLocator(mapComponent);
  addMapWidgets(mapComponent);
  addLocatePopupTemplate(mapComponent);
}

function createPatientMap(mapComponent: EsriMapComponent) {
  mapComponent.map = new mapComponent.esriService.Map({basemap: 'streets'});

  addCSVFeatureLayer(mapComponent);

  createMapView(mapComponent);

  initReverseLocator(mapComponent);
  addMapWidgets(mapComponent);
  addDetailsPopupAction(mapComponent);
}

// TODO: this does not work for some unknown reason...
function addFeatureLayer(mapComponent) {
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
    }
  );

  mapComponent.map.add(layer);
}

// TODO: backup because the dynamic one above does not work
function addCSVFeatureLayer(mapComponent) {
  const csvLayer = new mapComponent.esriService.layers.CSVLayer({
    url: '/api/map/dump',
    popupTemplate: {
      title: 'Info'
    }
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

  mapComponent.map.add(csvLayer);
}

function initReverseLocator(mapComponent) {
  mapComponent.locator = new mapComponent.esriService.tasks.Locator({
    url: 'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer'
  });
}

function addMapWidgets(mapComponent) {
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

function addLocatePopupTemplate(mapComponent) {
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

function addDetailsPopupAction(mapComponent) {
  const moreDetailsAction = {
    // This text is displayed as a tool tip
    title: 'Details',
    id: 'details',
    className: 'esri-icon-locked'
  };

  // Adds the action to the view's default popup.
  mapComponent.mapView.popup.actions.push(moreDetailsAction);

  // event handler that fires each time an action is clicked
  mapComponent.mapView.popup.on('trigger-action', (event) => {
    /* If the zoom-out action is clicked, the following code executes  */
    if (event.action.id === 'details') {
      mapComponent.onMapEvent.emit({ eventType: event.action.id });
    }
  });
}
