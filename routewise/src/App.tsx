import React, { useState } from 'react'
import './styles/App.css'

import Autocomplete from './Autocomplete';
import DateTimePicker from './DateTimePicker';
import CheckboxSet from './CheckboxSet';
import NumericInput from './NumericInput';
import TravelRouteComponent from './TravelPlanComponent';
import BufferingSign from './BufferingSign';
import Attraction from './Attraction';
import RouteMap from './RouteMap';

const SERVER_URL = '';

export interface AddressInfo {
  Latitude: string;
  Longitude: string;
  AddressStr: string;
}

interface Route {
  Time: number;
  Transportation: string[];
  RouteOverview: string;
}

export interface AttractionRecommendation {
  Name: string;
  Description: string;
  Location: string;
  Radius: number;
  Cost: number;
  Photos: string[];
  Address: AddressInfo;
}

interface AdditionalRecommendations {
  StopoverPoints: string; // описание точек остановки
  RestaurantsAndCafes: string; // описание рекомендованных ресторанов
}

interface BudgetUSD {
  Food: number;
  Miscellaneous: number;
}

export interface TravelPlan {
  Route: Route;
  AttractionRecommendations: AttractionRecommendation[];
  AdditionalRecommendations: AdditionalRecommendations;
  BudgetUSD: BudgetUSD;
  Notes: string;
}

function App() {
  const [city] = useState<string[]>(['Bratislava', 'Vienna']);
  const [startCity, setStartCity] = useState<string>("");
  const [destCity, setDestCity] = useState<string>("");

  const [startDateTime, setStartDateTime] = useState<string>('')
  const [endDateTime, setEndDateTime] = useState<string>('')


  const [transportation] = useState<string[]>(['bus', 'train', 'car', 'foot']);
  const [selectedTransportation, setSelectedTransportation] = useState<string[]>(transportation);

  const [interests] = useState<string[]>(['History and Culture', 'Science and Technology', 'Art and Creativity', 'Nature and Outdoor Activities',
    'Shopping and Markets', 'Modern Life and Nightlife', 'Food and Gastronomy ']);
  const [selectedInterests, setSelectedInterests] = useState<string[]>(interests);

  const [minNumPeople] = useState<number>(1);
  const [maxNumPeople] = useState<number>(10);

  const [selectedNumPeople, setSelectedNumPeople] = useState<number>(minNumPeople);

  const [ageGroups] = useState<string[]>(['0-12', '13-17', '18-30', '30-44', '45+']);
  const [selectedAgeGroups, setSelectedAgeGroups] = useState<string[]>(ageGroups);

  const [areRecsFilled, setAreRecsFilled] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [travelRoute, setTravelRoute] = useState<TravelPlan>();

  const testJson = `{
    "Name": "Schönbrunn Palace",
    "Description": "A magnificent baroque palace with vast gardens, offering a glimpse into the imperial history of Austria.",
    "Location": "48.1845,16.3119",
    "Radius": 500,
    "Cost": 50,
    "Address": {"AddressStr":"Schonbrunner Schlossstrasse 47, Vienna 1130 Austria","Latitude":"48.185135","Longitude":"16.312593"},
    "Photos": [
      "https://media-cdn.tripadvisor.com/media/photo-s/1c/2d/28/e4/wwwschoenbrunnat.jpg",
      "https://media-cdn.tripadvisor.com/media/photo-s/1c/2d/2e/78/wwwschoenbrunnat.jpg",
      "https://media-cdn.tripadvisor.com/media/photo-s/1c/2d/2e/74/wwwschoenbrunnat.jpg",
      "https://media-cdn.tripadvisor.com/media/photo-s/1c/2d/2e/70/wwwschoenbrunnat.jpg",
      "https://media-cdn.tripadvisor.com/media/photo-s/1c/2d/2e/69/wwwschoenbrunnat.jpg"
    ]
  }`;
  const [testAttraction] = useState<AttractionRecommendation>(JSON.parse(testJson));
  const [testAttractions] = useState<AttractionRecommendation[]>([testAttraction]);

  async function handleFindRoute() {
    setAreRecsFilled(false);

    console.log(startDateTime);
    let query_url = SERVER_URL;

    query_url = `?stcity=${startCity}`;
    query_url = `?destcity=${destCity}`;
    query_url = `?from=${startDateTime}`;
    query_url = `?to=${endDateTime}`;
    query_url = `?interests=${selectedInterests}`;
    query_url = `?numpeop=${selectedNumPeople}`;
    query_url = `?age=${selectedAgeGroups}`;

    setIsLoading(true)
    try {
      const response = await fetch(query_url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (e: any) {
      console.log("Error in finding route!");
      console.error(e);
    }


    setIsLoading(false);
  }


  return (
    <div className="main_page">
      <label>FILTERS</label>
      <div className="filter_section">
        <div>
          <Autocomplete label="Starting city" inputValue={startCity} setInputValue={setStartCity} options={city} />
          <Autocomplete label="Destination city" inputValue={destCity} setInputValue={setDestCity} options={city} />
        </div>
        <div>
          <DateTimePicker dateTime={startDateTime} setDateTime={setStartDateTime} textLabel="Starting date" />
          <DateTimePicker dateTime={endDateTime} setDateTime={setEndDateTime} textLabel="Ending date" />
        </div>
        <div>
          <CheckboxSet selectedOptions={selectedInterests} setSelectedOptions={setSelectedInterests} options={interests} label={"Choose your interests"} />
          <CheckboxSet selectedOptions={selectedAgeGroups} setSelectedOptions={setSelectedAgeGroups} options={ageGroups} label={"Choose your age groups"} />
        </div>
        <div>
          <NumericInput value={selectedNumPeople} setValue={setSelectedNumPeople} minValue={minNumPeople} maxValue={maxNumPeople} />
        </div>
        <div className="btn_container">
          <button className="btn" onClick={handleFindRoute}>FIND ROUTE</button>
          <button className="btn">CLEAR FILTERS</button>
        </div>
        <div>
          {isLoading && <BufferingSign />}
        </div>

      </div>
      <div className="routes_wrapper">
        <Attraction attraction={testAttraction} />
        <Attraction attraction={testAttraction} />
        <Attraction attraction={testAttraction} />
      </div>
      <RouteMap attractions={testAttractions} />

      {areRecsFilled && <TravelRouteComponent travelRoute={travelRoute} />}
    </div>
  )
}

export default App
