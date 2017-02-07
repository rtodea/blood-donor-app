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
}
