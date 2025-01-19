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
        <div className="route_container">
            <div>
                <label>Time {travelRoute?.Route.Time}</label>
                <label>Transport {travelRoute?.Route.Transportation}</label>
                <label>Short Description: {travelRoute?.Route.RouteOverview}</label>
            </div>

            <div>
                {travelRoute?.AttractionRecommendations.map(place => (
                    <Attraction attraction={place} />
                )
                )}
            </div>
            {travelRoute && <RouteMap attractions={travelRoute?.AttractionRecommendations} />}

        </div>
    );
};

export default TravelRouteComponent;