import { useEffect, useState } from "react";
import { TravelPlan } from "./App";
import "./styles/App.css";
import Attraction from "./Attraction";
import { AddressInfo } from "./App";
import { TravelMode } from "./RouteModeSelector";
import RouteMap from "./RouteMap";
import { AttractionRecommendation } from "./App";

interface TravelRouteComponentProps {
  attractions: AttractionRecommendation[];
  setAttractions: (attractions: AttractionRecommendation[]) => void;

  travelRoute: TravelPlan | undefined;
  startCity: AddressInfo;
  endCity: AddressInfo;
  travelMode: TravelMode;
}

const TravelRouteComponent = ({
  attractions,
  setAttractions,
  travelRoute,
  startCity,
  endCity,
  travelMode,
}: TravelRouteComponentProps) => {
  const toggleUnwanted = (index: number) => {
    const updated = attractions.map((attr, i) =>
      i === index ? { ...attr, Unwanted: !attr.Unwanted } : attr
    );
    setAttractions(updated);
  };

  return (
    <div>
      <div className="travel-info">
        <p>
          <b>Short Description:</b> {travelRoute?.Route.RouteOverview}
        </p>
        <p>
          <b>Destination fact:</b> {travelRoute?.Route.DestFact}
        </p>
        <p>
          <b>Restaurants and Cafes:</b> {travelRoute?.RestaurantsAndCafes}
        </p>
        <p>
          <b>Total Budget:</b> {travelRoute?.BudgetUSD.Food} USD (food),{" "}
          {travelRoute?.BudgetUSD.Miscellaneous} USD (miscellaneous)
        </p>
        <p>
          <b>Notes:</b> {travelRoute?.Notes}
        </p>
      </div>

      {travelRoute && travelRoute.AttractionRecommendations.length <= 25 && (
        <RouteMap
          startCity={startCity}
          endCity={endCity}
          attractions={attractions}
          travelMode={travelMode}
        />
      )}

      <div className="routes_wrapper">
        {attractions.map((place, index) => (
          <Attraction
            key={index}
            attraction={place}
            onToggle={() => toggleUnwanted(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default TravelRouteComponent;
