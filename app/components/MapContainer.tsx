import React, { useRef, useEffect } from 'react';

import log from 'loglevel';
import loadGoogleMapsApi from '../util/loadGoogleMapsApi';
import { Location } from '../types/GoogleMaps';

const mapStyle: React.CSSProperties = {
  height: '40vh',
  width: '100%',
  marginBottom: '20px'
};

const panoStyle: React.CSSProperties = {
  height: '40vh',
  width: '100%'
};

interface Props {
  location: Location;
}

const MapContainer: React.FC<Props> = ({ location }: Props) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const panoRef = useRef<HTMLDivElement>(null);
  const map = useRef<google.maps.Map>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const googleApi = useRef<any>();

  useEffect(() => {
    function setStreetView(pano: google.maps.StreetViewPanorama): void {
      log.debug(`setting street view.. ${pano}   map:${map}`);
      if (map.current) map.current.setStreetView(pano);
    }

    function createMap() {
      try {
        log.debug(`creating map... mapref:${mapRef}`);
        const m = mapRef.current;
        return new googleApi.current.Map(m, {
          center: location.position,
          zoom: 16
        });
      } catch (e) {
        log.error('Error occurred creating map');
        log.error(e);
        return null;
      }
    }

    function createPano() {
      log.debug('MapContainer - create Pano');
      try {
        const panoDiv = panoRef.current;
        const panorama = new googleApi.current.StreetViewPanorama(panoDiv, {
          position: location.position,
          pov: {
            heading: location.pov.heading,
            pitch: location.pov.pitch,
            zoom: 1
          }
        });
        setStreetView(panorama);
      } catch (e) {
        log.error('Error occurred creating pano');
        log.error(e);
      }
    }

    if (!map.current && mapRef) {
      loadGoogleMapsApi({ key: process.env.GOOGLE_MAPS_API_KEY }).then(
        (api): void => {
          log.debug('MapContainer: Maps API loaded');
          googleApi.current = api;
          map.current = createMap();
          createPano();
        }
      );
    } else {
      log.debug(`map.panTo...`);
      if (map.current)
        map.current.panTo({ lat: location.position.lat, lng: location.position.lng });
      createPano();
    }
  }, [location]);

  return (
    <div>
      <div style={mapStyle} ref={mapRef} />
      <div style={panoStyle} ref={panoRef} />
    </div>
  );
};

export default MapContainer;
