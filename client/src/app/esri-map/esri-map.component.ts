import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-esri-map',
  templateUrl: './esri-map.component.html',
  styleUrls: ['./esri-map.component.css']
})
export class EsriMapComponent implements OnInit {
  mapProperties: __esri.MapProperties = {
    basemap: 'dark-gray'
  };
  mapViewProperties: __esri.MapViewProperties = {
    center: [-118, 34.5],
    zoom: 8,
  };
  map: __esri.Map;
  mapView: __esri.MapView;
  Search: __esri.Search;

  constructor() { }

  ngOnInit() { }

  onMapInit(mapInfo: {map: __esri.Map, mapView: __esri.MapView}) {
    this.map = mapInfo.map;
    this.mapView = mapInfo.mapView;
    this.addWidgets();
  }

  private addWidgets() {
    this.addSearchWidget();
  }

  private addSearchWidget() {
    console.log(this.Search);
    // this.mapView.ui.add(new Search({ view: this.mapView }), {
    //   position: 'top-left',
    //   index: 0
    // });
  }
}
