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
                center: [-74.5, 40], // starting position [lng, lat]
                zoom: 9 // starting zoom
            });
        }
    }, []); // Empty dependency array to run only once

    useEffect(() => {
        for (const marker of markers.current) {
            marker.remove();
        }

        markers.current = [];

        for (const attraction of attractions) {
            const marker = new mapboxgl.Marker()
                .setLngLat([parseFloat(attraction.Address.Longitude), parseFloat(attraction.Address.Latitude)])
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
