import { Injectable } from '@angular/core';
import { EsriLoaderService } from 'angular2-esri-loader';

@Injectable()
export class EsriService {

  isLoaded;
  Map = null;
  views = {
    MapView: null
  };
  widgets = {
    Search: null,
    Locate: null
  };

  constructor(private esriLoader: EsriLoaderService) {
    this.isLoaded = this.load();
  }

  private load() {
    return this.esriLoader.load({
      // use a specific version of the API instead of the latest
      url: 'https://js.arcgis.com/4.2/'
    }).then(() => {
      // load the map class needed to create a new map
      return this.esriLoader.loadModules([
        'esri/Map',
        'esri/views/MapView',
        'esri/widgets/Search',
        'esri/widgets/Locate',
        'dojo/domReady!'
      ]).then(([Map, MapView, Search, Locate]) => {
        this.Map = Map;
        this.views.MapView = MapView;
        this.widgets.Search = Search;
        this.widgets.Locate = Locate;
      });
    });
  }
}
