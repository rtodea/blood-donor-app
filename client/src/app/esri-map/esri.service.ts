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
  tasks = {
    Locator: null
  };
  layers = {
    FeatureLayer: null,
    CSVLayer: null
  };
  geometry = {
    Point: null
  };
  renderers = {
    SimpleRenderer: null
  };
  symbols = {
    SimpleMarkerSymbol: null
  };
  urlUtils;
  esriConfig;

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
        'esri/tasks/Locator',
        'esri/layers/FeatureLayer',
        'esri/layers/CSVLayer',
        'esri/geometry/Point',
        'esri/renderers/SimpleRenderer',
        'esri/symbols/SimpleMarkerSymbol',
        'esri/core/urlUtils',
        'esri/config',
        'dojo/domReady!'
      ]).then(([Map, MapView, Search, Locate, Locator, FeatureLayer, CSVLayer, Point, SimpleRenderer,
                SimpleMarkerSymbol, urlUtils, esriConfig]) => {
        this.Map = Map;
        this.views.MapView = MapView;
        this.widgets.Search = Search;
        this.widgets.Locate = Locate;
        this.tasks.Locator = Locator;
        this.layers.FeatureLayer = FeatureLayer;
        this.layers.CSVLayer = CSVLayer;
        this.geometry.Point = Point;
        this.renderers.SimpleRenderer = SimpleRenderer;
        this.symbols.SimpleMarkerSymbol = SimpleMarkerSymbol;
        this.urlUtils = urlUtils;
        this.esriConfig = esriConfig;
      });
    });
  }
}
