// import { useRef } from 'react';;
// import { useMap } from '../hook/useMap';
import { useEffect, useCallback, useState } from 'react';
import Map, { Marker, Source, Layer, MapLayerMouseEvent, CircleLayer } from 'react-map-gl';
import { getEnvironments } from '../utils/getEnvironments';
import marker from '../assets/marker.png'
import GeocoderControl from './GeocoderControl'
const { VITE_KEY } = getEnvironments()

interface HoverInfo {
    longitude: number,
    latitude: number,
    countyName: string | null | undefined
}
  
  const layerStyle: CircleLayer = {
    id: 'point',
    type: 'circle',
    paint: {
      'circle-radius': 10,
      'circle-color': '#007cbf'
    }
  };
export const MapView = () => {
    const [hoverInfo, setHoverInfo] = useState<HoverInfo | null>(null);

    const [initialPos, setInitialPos] = useState<{lat: number, lng: number}>({
        lat: 3.454,
        lng: 4.567
    })

    const onHover = useCallback((event: MapLayerMouseEvent) => {
        // console.log(event.features, 'LLLLLLL');

        const county = event.features && event.features[0];
        setHoverInfo({
            longitude: event.lngLat.lng,
            latitude: event.lngLat.lat,
            countyName: county && county.properties?.COUNTY
        });
    }, []);
console.log(hoverInfo);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition( (pos) => {
            setInitialPos({lat: pos.coords.latitude, lng: pos.coords.longitude})
        })
    }, [])
    return (
        <Map
            mapboxAccessToken={VITE_KEY}
            initialViewState={{
                latitude: initialPos.lat,
                longitude: initialPos.lng,
                zoom: 3
            }}
            style={{ width: '100vw', height: '100vh' }}
            mapStyle="mapbox://styles/mapbox/streets-v9"
            interactiveLayerIds={['country']}
            onMouseMove={onHover}
        >
            <Source id="my-data" type="geojson" >
                <Layer {...layerStyle} />
            </Source>
            <Marker longitude={-100} latitude={40} anchor="bottom" >
                <img className='marker' src={marker} />
            </Marker>

            <GeocoderControl mapboxAccessToken={VITE_KEY} position="top-left" />
        </Map>
    )
}