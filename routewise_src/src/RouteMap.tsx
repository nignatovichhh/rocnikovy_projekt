import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

import 'mapbox-gl/dist/mapbox-gl.css';
import { AttractionRecommendation } from './App';

interface RouteMapProps {
    attractions: AttractionRecommendation[];
}

const RouteMap = ({ attractions }: RouteMapProps) => {
    const mapContainerRef = useRef<HTMLDivElement | null>(null); // Specify the type explicitly
    const mapRef = useRef<mapboxgl.Map | null>(null); // Optional: type for the Mapbox map instance
    const markers = useRef<mapboxgl.Marker[]>([]);

    useEffect(() => {
        if (mapContainerRef.current) {
            console.log("map")
            mapboxgl.accessToken = 'pk.eyJ1IjoiaWhuYXRvdmljaDEiLCJhIjoiY202M3JiaDN6MTV2dzJqc2YyZmUzcHNldyJ9.B6Z-eBKtkHJ77nb4iU2XCA';

            mapRef.current = new mapboxgl.Map({
                container: mapContainerRef.current,
                center: [17.10, 48.14], // starting position [lng, lat]
                zoom: 5 // starting zoom
            });
        }
    }, []); // Empty dependency array to run only once

    useEffect(() => {
        for (const marker of markers.current) {
            marker.remove();
        }

        markers.current = [];

        let center_long = 17.10, center_lat = 48.14; // Bratislava coord

        for (const attraction of attractions) {
            if (attraction.Address.Longitude == "" || attraction.Address.Latitude == "")
                continue
            center_long = parseFloat(attraction.Address.Longitude)
            center_lat = parseFloat(attraction.Address.Latitude)
        }

        mapRef.current!.setCenter([center_long, center_lat]);

        for (const attraction of attractions) {
            if (attraction.Address.Longitude == "" || attraction.Address.Latitude == "")
                continue
            let long = parseFloat(attraction.Address.Longitude)
            let lat = parseFloat(attraction.Address.Latitude)

            const marker = new mapboxgl.Marker()
                .setLngLat([long, lat])
                .setPopup(new mapboxgl.Popup().setText(attraction.Name))
                .addTo(mapRef.current!);
        }
    }, [attractions]);

    return (
        <div
            style={{ height: '500px' }}
            ref={mapContainerRef}
            className="map-container"
        />
    );
};

export default RouteMap;
