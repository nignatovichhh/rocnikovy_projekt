import React, { useEffect, useRef } from 'react';
import { TravelPlan } from "./App";
import './styles/App.css';
import Attraction from './Attraction';
import RouteMap from "./RouteMap";

interface TravelRouteComponentProps {
    travelRoute: TravelPlan | undefined;
}

const TravelRouteComponent = ({ travelRoute }: TravelRouteComponentProps) => {

    return (
        <div>
            <div>
                <p>Transport: {travelRoute?.Route.Transportation.map((tr, index) => (
                    <span key={index}>{tr} </span>
                ))}</p>
                <p>Short Description: {travelRoute?.Route.RouteOverview}</p>
            </div>

            <div className="routes_wrapper">
                {travelRoute?.AttractionRecommendations.map((place, index) => (
                    <Attraction key={index} attraction={place} />
                )
                )}
            </div>
            {travelRoute && <RouteMap attractions={travelRoute?.AttractionRecommendations} />}

        </div>
    );
};

export default TravelRouteComponent;