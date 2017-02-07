import { Component, OnInit, EventEmitter, ViewChild, ElementRef, Output } from '@angular/core';

import { EsriService } from './esri.service';

@Component({
  selector: 'app-esri-map',
  templateUrl: './esri-map.component.html',
  styleUrls: ['./esri-map.component.css']
})
export class EsriMapComponent implements OnInit {
  @ViewChild('map') mapEl: ElementRef;

  @Output() onMapEvent = new EventEmitter<any>();

  mapView: __esri.MapView;
  map: __esri.Map;
  locator: __esri.Locator;

  constructor(private esriService: EsriService) {
  }

  ngOnInit() {
    // only load the ArcGIS API for JavaScript when this component is loaded
    return this.esriService.isLoaded.then(() => {
      this.create();
    });
  }

  private create() {
    this.map = new this.esriService.Map({basemap: 'streets'});

    this.addCSVFeatureLayer();

    this.mapView = new this.esriService.views.MapView({
      container: this.mapEl.nativeElement.id,
      map: this.map,
      zoom: 4,
      center: [22, 45]  // Sets the center point of view in lon/lat
    });

    this.initReverseLocator();
    this.addMapWidgets();
    this.addPopupTemplate();
  }

  // TODO: this does not work for some unknown reason...
  private addFeatureLayer() {
    const renderer = new this.esriService.renderers.SimpleRenderer({
      symbol: new this.esriService.symbols.SimpleMarkerSymbol({
        style: 'circle',
        size: '20px',
        color: '#673ab7',
        outline: { // autocasts as new SimpleLineSymbol()
          color: [255, 64, 0, 0.4], // autocasts as new Color()
          width: 7
        }
      })
    });

    const layer = new this.esriService.layers.FeatureLayer({
        source: [
          {
            geometry: new this.esriService.geometry.Point({
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

    this.map.add(layer);
  }

  // TODO: backup because the dynamic one above does not work
  private addCSVFeatureLayer() {
    const url = '/api/map/dump';

    const csvLayer = new this.esriService.layers.CSVLayer({ url });

    csvLayer.renderer = new this.esriService.renderers.SimpleRenderer({
      symbol: new this.esriService.symbols.SimpleMarkerSymbol({
        size: '23px',
        color: [238, 69, 0, 0.5],
        outline: {
          width: 0.5,
          color: 'white'
        }
      })
    });

    this.map.add(csvLayer);
  }

  private initReverseLocator() {
    this.locator = new this.esriService.tasks.Locator({
      url: 'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer'
    });
  }

  private addMapWidgets() {
    const searchWidget = new this.esriService.widgets.Search({view: this.mapView});

    this.mapView.ui.add(searchWidget, {
      position: 'top-left',
      index: 0
    });

    const locateBtn = new this.esriService.widgets.Locate({view: this.mapView});

    // Add the locate widget to the top left corner of the view
    this.mapView.ui.add(locateBtn, {
      position: 'top-left',
      index: 1
    });
  }

  addPopupTemplate() {
    const locationDetails = { mapPoint: null, address: null };

    this.mapView.on('click', ({mapPoint}) => {
      this.locator.locationToAddress(mapPoint)
        .then((response) => {
          this.mapView.popup.open({
            title: 'Set current location',
            location: mapPoint,
            content: response.address.Match_addr
          });
          // this.onMapEvent.emit({eventType: 'click', address: response.address, mapPoint});
          locationDetails.mapPoint = mapPoint;
          locationDetails.address = response.address;
        })
        .otherwise(() => {
          this.mapView.popup.open({
            title: `Set current location to [Lon: ${mapPoint.longitude}, Lat: ${mapPoint.latitude}]`,
            location: mapPoint,
            content: 'No address was found for this location'
          });
          locationDetails.mapPoint = mapPoint;
          locationDetails.address = null;
          // this.onMapEvent.emit({eventType: 'click', mapPoint});
        });
    });

    const moreDetailsAction = {
      // This text is displayed as a tool tip
      title: 'Register',
      id: 'register',
      className: 'esri-icon-authorize'
    };

    // Adds the action to the view's default popup.
    this.mapView.popup.actions.push(moreDetailsAction);

    // event handler that fires each time an action is clicked
    this.mapView.popup.on('trigger-action', (event) => {
      /* If the zoom-out action is clicked, the following code executes  */
      if (event.action.id === 'register') {
        this.onMapEvent.emit({eventType: event.action.id, mapPoint: locationDetails.mapPoint, address: locationDetails.address });
      }
    });
  }
}
