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

const SERVER_URL = 'https://rocnikovy-projekt.onrender.com';

export interface AddressInfo {
  Latitude: string;
  Longitude: string;
  AddressStr: string;
}

interface Route {
  TravelTime: number;
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
  const [startCity, setStartCity] = useState<string>("Vienna");
  const [destCity, setDestCity] = useState<string>("Linz");

  const [startDateTime, setStartDateTime] = useState<string>(getCurrentDateTime(1))
  const [endDateTime, setEndDateTime] = useState<string>(getCurrentDateTime(5))


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

  function getCurrentDateTime(add_hours: number) {
    const now = new Date();

    now.setHours(now.getHours() + add_hours);
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const date = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${date}T${hours}:${minutes}`;
  };

  async function handleFindRoute() {
    setAreRecsFilled(false);

    console.log(startDateTime);
    let query_url = SERVER_URL + "/find_route";

    query_url += `?starting_city=${startCity}`;
    query_url += `&destination_city=${destCity}`;
    query_url += `&departure=${startDateTime}`;
    query_url += `&arrival=${endDateTime}`;
    query_url += `&interests=${selectedInterests}`;
    query_url += `&number_people=${selectedNumPeople}`;
    query_url += `&age=${selectedAgeGroups}`;

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

      const responseJson = await response.json();
      console.log("ANS")
      console.log(responseJson);

      setTravelRoute(responseJson)
      setAreRecsFilled(true)

    } catch (e: any) {
      console.log("Error in finding route!");
      console.error(e);
    }


    setIsLoading(false);
  }

  function handleClearFilters() {
    setStartDateTime(getCurrentDateTime(1));
    setEndDateTime(getCurrentDateTime(5));
    setSelectedInterests(interests);
    setSelectedNumPeople(minNumPeople);
    setSelectedAgeGroups(ageGroups);
    setStartCity("Vienna");
    setDestCity("Linz");
  }


  return (
    <div className="main_page">
      <p style={{ color: "red" }}>Note: At the moment the purpose of this page is to visualize the interaction of APIs.
        Please enter correct data, handling of exceptional cases will be added in
        future versions. First query search can take about 2 minutes because of hosting service management of inactivity.</p>
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
          <button className="btn" onClick={handleClearFilters}>CLEAR FILTERS</button>
        </div>
        <div>
          {isLoading && <BufferingSign />}
        </div>

      </div>
      {areRecsFilled && <TravelRouteComponent travelRoute={travelRoute} />}
    </div >
  )
}

export default App
