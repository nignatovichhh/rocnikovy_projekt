import React, { useState } from 'react';
import { AttractionRecommendation } from "./App";
import './styles/App.css';
import PhotoCarousel from './PhotoCarousel';

interface AttractionProps {
    attraction: AttractionRecommendation;
}

const Attraction = ({ attraction }: AttractionProps) => {

    return (
        <div className="route_container">
            <div>
                <h4>{attraction.Name}</h4>
                <p className="address">{attraction.Address.AddressStr}</p>
                <p>{attraction.Description}</p>
                <p>{attraction.Cost} USD</p>
            </div>

            <PhotoCarousel images={attraction.Photos} />

        </div>
    );
};

export default Attraction;