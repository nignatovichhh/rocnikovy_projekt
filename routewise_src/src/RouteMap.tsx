import React, { useState, useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import { Feature, LineString } from "geojson";
import { AddressInfo } from "./App";
import { TravelMode } from "./RouteModeSelector";
import "./styles/App.css";

import "mapbox-gl/dist/mapbox-gl.css";
import { AttractionRecommendation } from "./App";

const ACCESS_TOKEN =
  "pk.eyJ1IjoiaWhuYXRvdmljaDEiLCJhIjoiY202M3JiaDN6MTV2dzJqc2YyZmUzcHNldyJ9.B6Z-eBKtkHJ77nb4iU2XCA";

interface RouteMapProps {
  attractions: AttractionRecommendation[];
  startCity: AddressInfo;
  endCity: AddressInfo;
  travelMode: TravelMode;
}

export async function getRoute(
  coordArr: [string, string][],
  travelMode: TravelMode
) {
  let queryUrl = "https://api.mapbox.com/directions/v5/mapbox/";
  queryUrl += `${travelMode}/`;

  for (const coord of coordArr) {
    if (coord[0] == "" || coord[1] == "") continue;

    queryUrl += `${coord[0]},`;
    queryUrl += `${coord[1]};`;
  }

  queryUrl = queryUrl.slice(0, -1);
  queryUrl += `?steps=true&geometries=geojson&access_token=${ACCESS_TOKEN}`;

  const query = await fetch(queryUrl);
  const json = await query.json();
  console.log(json);

  if (json.code.toLowerCase() != "ok") return null;

  const data = json.routes[0];

  return data;
}

const RouteMap = ({
  attractions,
  startCity,
  endCity,
  travelMode,
}: RouteMapProps) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null); // Specify the type explicitly
  const mapRef = useRef<mapboxgl.Map | null>(null); // Optional: type for the Mapbox map instance
  const markers = useRef<mapboxgl.Marker[]>([]);
  let [gMLink, setGMLink] = useState<string>("");
  const [duration, setDuration] = useState<number>(0);
  const [distance, setDistance] = useState<number>(0);

  useEffect(() => {
    if (mapContainerRef.current) {
      console.log("map");
      mapboxgl.accessToken = ACCESS_TOKEN;

      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        center: [17.1, 48.14], // starting position [lng, lat]
        zoom: 5, // starting zoom
      });
      mapRef.current!.addControl(new mapboxgl.FullscreenControl(), "top-right");
      mapRef.current!.addControl(new mapboxgl.NavigationControl(), "top-right");
      setStartEndMarkers();
    }
  }, []); // Empty dependency array to run only once

  function setStartEndMarkers() {
    if (!startCity || !endCity) return;
    markers.current.push(
      new mapboxgl.Marker()
        .setLngLat([
          parseFloat(startCity.Longitude),
          parseFloat(startCity.Latitude),
        ])
        .setPopup(new mapboxgl.Popup().setText(startCity.AddressStr))
        .addTo(mapRef.current!)
    );

    markers.current.push(
      new mapboxgl.Marker()
        .setLngLat([
          parseFloat(endCity.Longitude),
          parseFloat(endCity.Latitude),
        ])
        .setPopup(new mapboxgl.Popup().setText(endCity.AddressStr))
        .addTo(mapRef.current!)
    );
  }

  function clearMap() {
    markers.current.forEach((marker) => marker.remove());
    markers.current = [];

    if (mapRef.current?.getLayer("route")) {
      mapRef.current.removeLayer("route");
    }
    if (mapRef.current?.getSource("route")) {
      mapRef.current.removeSource("route");
    }
  }

  useEffect(() => {
    clearMap();

    setStartEndMarkers();

    setRoute(
      [
        [startCity.Longitude, startCity.Latitude],
        [endCity.Longitude, endCity.Latitude],
      ],
      true
    );
  }, [startCity, endCity]);

  async function setRoute(coordArr: [string, string][], toSetParams: boolean) {
    let data = await getRoute(coordArr, travelMode);
    if (data == null) {
      alert("Error! No route exists");
      return;
    }
    const geojson: Feature<LineString> = {
      type: "Feature",
      properties: {},
      geometry: data.geometry,
    };

    if (mapRef.current!.getSource("route")) {
      const source = mapRef.current!.getSource(
        "route"
      ) as mapboxgl.GeoJSONSource;
      source.setData(geojson);
    } else {
      mapRef.current!.addLayer({
        id: "route",
        type: "line",
        source: {
          type: "geojson",
          data: geojson,
        },
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#3887be",
          "line-width": 5,
          "line-opacity": 0.75,
        },
      });
    }

    if (toSetParams) {
      setDuration(data.duration);
      setDistance(data.distance);
    }

    return [data.distance, data.duration];
  }

  function changeGMLink(coordArr: [string, string][]) {
    let googleM = "https://www.google.com/maps/dir/?api=1";

    googleM += `&origin=${coordArr[0][1]},${coordArr[0][0]}`;
    googleM += `&destination=${coordArr[coordArr.length - 1][1]},${
      coordArr[coordArr.length - 1][0]
    }`;

    if (coordArr.length > 2) {
      googleM += "&waypoints=";

      for (let i = 1; i < coordArr.length - 1; i++) {
        googleM += `${coordArr[i][1]},${coordArr[i][0]}|`;
      }

      googleM = googleM.slice(0, -1);
    }

    setGMLink(googleM);
  }

  useEffect(() => {
    clearMap();

    let center_long = 17.1,
      center_lat = 48.14; // Bratislava coord

    for (const attraction of attractions) {
      if (
        attraction.Address.Longitude == "" ||
        attraction.Address.Latitude == ""
      )
        continue;
      center_long = parseFloat(attraction.Address.Longitude);
      center_lat = parseFloat(attraction.Address.Latitude);
      break;
    }

    mapRef.current!.setCenter([center_long, center_lat]);

    let coords: [string, string][] = [
      [startCity.Longitude, startCity.Latitude],
      ...attractions
        .filter((attr) => !attr.Unwanted)
        .map(
          (item) =>
            [item.Address.Longitude, item.Address.Latitude] as [string, string]
        ),
      [endCity.Longitude, endCity.Latitude],
    ];

    setRoute(coords, true);

    changeGMLink(coords);

    setStartEndMarkers();
    for (const attraction of attractions) {
      if (
        attraction.Address.Longitude == "" ||
        attraction.Address.Latitude == ""
      )
        continue;
      let long = parseFloat(attraction.Address.Longitude);
      let lat = parseFloat(attraction.Address.Latitude);

      markers.current.push(
        new mapboxgl.Marker()
          .setLngLat([long, lat])
          .setPopup(new mapboxgl.Popup().setText(attraction.Name))
          .addTo(mapRef.current!)
      );
    }
  }, [attractions]);

  return (
    <>
      <div className="travel-info">
        <a href={gMLink}>Google Map Link to the Route</a>
        {duration > 0 && (
          <h3>
            Duration: {Math.floor(duration / 3600)} h{" "}
            {Math.floor(((duration % 3600) / 3600) * 60)} min
          </h3>
        )}
        {distance > 0 && <h3>Distance: {Math.round(distance / 1000)} km</h3>}
      </div>
      <div
        style={{ height: "500px" }}
        ref={mapContainerRef}
        className="map-container"
      />
    </>
  );
};

export default RouteMap;
