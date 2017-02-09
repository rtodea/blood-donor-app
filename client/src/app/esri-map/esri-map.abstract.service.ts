export class AbstractMapService {

  addMapView(mapComponent) {
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

  addMapWidgets(mapComponent) {
    const searchWidget = new mapComponent.esriService.widgets.Search({view: mapComponent.mapView});

    mapComponent.mapView.ui.add(searchWidget, {
      position: 'bottom-left',
      index: 1
    });

    const locateBtn = new mapComponent.esriService.widgets.Locate({view: mapComponent.mapView});

    // Add the locate widget to the top left corner of the view
    mapComponent.mapView.ui.add(locateBtn, {
      position: 'bottom-left',
      index: 0
    });

    mapComponent.mapView.ui.move(['zoom'], 'bottom-right');
  }
}
