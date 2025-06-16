import React, { useState } from "react";
import { AttractionRecommendation } from "./App";
import "./styles/App.css";
import PhotoCarousel from "./PhotoCarousel";

interface AttractionProps {
  attraction: AttractionRecommendation;
  onToggle: () => void;
}

const Attraction = ({ attraction, onToggle }: AttractionProps) => {
  return (
    <div
      className="route_container"
      style={attraction.Unwanted ? { opacity: 0.5 } : {}}
    >
      <div>
        {attraction.Link !== "" ? (
          <a href={attraction.Link}>
            <h4>{attraction.Name}</h4>
          </a>
        ) : (
          <h4>{attraction.Name}</h4>
        )}

        <p className="address">{attraction.Address.AddressStr}</p>
        <p>{attraction.Description}</p>
      </div>

      <PhotoCarousel images={attraction.Photos} />
      <button className="btn" style={{ marginTop: 2 }} onClick={onToggle}>
        {attraction.Unwanted ? "INCLUDE" : "EXCLUDE"}
      </button>
    </div>
  );
};

export default Attraction;
