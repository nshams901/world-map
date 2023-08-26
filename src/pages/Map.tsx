// import { useRef } from 'react';;
// import { useMap } from '../hook/useMap';
import { useEffect, useState } from 'react';
import Map, { Marker, Source, Layer, CircleLayer } from 'react-map-gl';
import { getEnvironments } from '../utils/getEnvironments';
import marker from '../assets/marker.png'
import GeocoderControl from './GeocoderControl'
import CountryDetailCard from './CountryDetailCard'
const { VITE_KEY } = getEnvironments()
  
  const layerStyle: CircleLayer = {
    id: 'point',
    type: 'circle',
    paint: {
      'circle-radius': 10,
      'circle-color': '#007cbf'
    }
  };
export const MapView = () => {

    const [initialPos, setInitialPos] = useState<{lat: number, lng: number}>({
        lat: 3.454,
        lng: 4.567
    });

    const [country, setCountry] = useState({ countryName: '', countryCode: ''});
    const [countryData, setCountryData] = useState()

    useEffect(() => {
        navigator.geolocation.getCurrentPosition( (pos) => {
            setInitialPos({lat: pos.coords.latitude, lng: pos.coords.longitude})
        })
    }, [])

    const handleClick = async( e: any) => {
        const { lat, lng } = e.lngLat
        
        let resp = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${VITE_KEY}`)
        let d  = await resp.json()
        const features = d.features
        const data = features.find(( item: any) => item.place_type.includes('country'));
        
        setCountry({ countryCode: data.properties.short_code, countryName: data.place_name});

        getCountryDetails(data.properties.short_code)
    }
    const getCountryDetails = async (code: string) => {
        let resp = await fetch(`https://api.worldbank.org/v2/country/${code.toUpperCase()}?format=json`);
        let r: any = await resp.json()
        
        setCountryData(r[1][0])
    }
    console.log(country, '+++++++++++++++++++++');
    
    return (
        <>
            <Map
                mapboxAccessToken={VITE_KEY}
                initialViewState={{
                    latitude: initialPos.lat,
                    longitude: initialPos.lng,
                    zoom: 2
                }}
                style={{ width: '100vw', height: '100vh' }}
                mapStyle="mapbox://styles/mapbox/streets-v9"
                interactiveLayerIds={['country']}
                onClick={ handleClick}
                
            >
                <Source id="my-data" type="geojson" >
                    <Layer {...layerStyle} />
                </Source>
                <Marker longitude={initialPos.lng} latitude={initialPos.lat} anchor="bottom" >
                    <img className='marker' src={marker} />
                </Marker>

                <GeocoderControl mapboxAccessToken={VITE_KEY} position="top-left" />
            </Map>
            
            <CountryDetailCard data={countryData}/>
        </>
    )
}