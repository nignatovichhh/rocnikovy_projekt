import React, { useState } from "react";
import "./styles/App.css";

import Autocomplete from "./Autocomplete";
import DateTimePicker from "./DateTimePicker";
import CheckboxSet from "./CheckboxSet";
import NumericInput from "./NumericInput";
import TravelRouteComponent from "./TravelPlanComponent";
import BufferingSign from "./BufferingSign";
import RouteMap, { getRoute } from "./RouteMap";
import RouteModeSelector, { TravelMode } from "./RouteModeSelector";
import { set } from "react-datepicker/dist/date_utils";

const SERVER_URL = "https://rocnikovy-projekt.onrender.com";

export interface AddressInfo {
  Latitude: string;
  Longitude: string;
  AddressStr: string;
}

interface Route {
  RouteOverview: string;
  DestFact: string;
}

export interface AttractionRecommendation {
  Name: string;
  Description: string;
  Location: string;
  Radius: number;
  Cost: number;
  Photos: string[];
  Address: AddressInfo;
  Link: string;
  Unwanted: boolean;
}

interface BudgetUSD {
  Food: number;
  Miscellaneous: number;
}

export interface TravelPlan {
  Route: Route;
  AttractionRecommendations: AttractionRecommendation[];
  RestaurantsAndCafes: string;
  BudgetUSD: BudgetUSD;
  Notes: string;
}

function App() {
  const defaultStartCity: AddressInfo = {
    Latitude: "48.143515",
    Longitude: "17.108279",
    AddressStr: "Bratislava, Slovakia",
  };
  const defaultEndCity: AddressInfo = {
    Latitude: "48.305813",
    Longitude: "14.284805",
    AddressStr: "Linz, Upper Austria, Austria",
  };

  const [activeSection, setActiveSection] = useState<number>(0);
  const [travelMode, setTravelMode] = useState<TravelMode>("driving");

  const [startCity, setStartCity] = useState<AddressInfo>(defaultStartCity);
  const [destCity, setDestCity] = useState<AddressInfo>(defaultEndCity);
  const [minDurationS, setMinDurationS] = useState<number>(0);

  const [includeStart, setIncludeStart] = useState(false);
  const [includeEnd, setIncludeEnd] = useState(true);

  const [startDateTime, setStartDateTime] = useState<string>(
    getCurrentDateTime(1)
  );
  const [endDateTime, setEndDateTime] = useState<string>(getCurrentDateTime(5));

  const [transportation] = useState<string[]>(["bus", "train", "car", "foot"]);
  const [selectedTransportation, setSelectedTransportation] =
    useState<string[]>(transportation);

  const [interests] = useState<string[]>([
    "History and Culture",
    "Science and Technology",
    "Art and Creativity",
    "Nature and Outdoor Activities",
    "Shopping and Markets",
    "Modern Life and Nightlife",
    "Food and Gastronomy ",
  ]);
  const [selectedInterests, setSelectedInterests] =
    useState<string[]>(interests);

  const [minNumPeople] = useState<number>(1);
  const [maxNumPeople] = useState<number>(10);

  const [selectedNumPeople, setSelectedNumPeople] =
    useState<number>(minNumPeople);

  const [ageGroups] = useState<string[]>([
    "0-12",
    "13-17",
    "18-30",
    "30-44",
    "45+",
  ]);
  const [selectedAgeGroups, setSelectedAgeGroups] =
    useState<string[]>(ageGroups);

  const [areRecsFilled, setAreRecsFilled] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [attractions, setAttractions] = useState<AttractionRecommendation[]>(
    []
  );

  const [travelRoute, setTravelRoute] = useState<TravelPlan>(); /*{
    AdditionalRecommendations: {
      RestaurantsAndCafes:
        "Try 'Cafe Puschkenc' in Wels for a local coffee experience.",
      StopoverPoints:
        "Consider stopping in Sankt Pölten and Wels for short city walks and coffee breaks.",
    },
    AttractionRecommendations: [
      {
        Address: {
          AddressStr: "Schlossplatz 1, Laxenburg 2361 Austria",
          Latitude: "48.0661",
          Longitude: "16.359035",
        },
        Cost: 20,
        Description:
          "A beautiful park and palace complex, perfect for a leisurely walk and picnics with the family.",
        Location: "48.058759,16.366867",
        Name: "Schlosspark Laxenburg",
        Photos: [
          "https://media-cdn.tripadvisor.com/media/photo-s/05/13/08/0e/schlosspark-laxenburg.jpg",
          "https://media-cdn.tripadvisor.com/media/photo-s/01/8b/5b/4e/die-franzensburg-im-lexenburger.jpg",
          "https://media-cdn.tripadvisor.com/media/photo-s/29/56/eb/a3/osterreich-schlosspark.jpg",
          "https://media-cdn.tripadvisor.com/media/photo-s/1a/72/c6/10/schlosspark-laxenburg.jpg",
          "https://media-cdn.tripadvisor.com/media/photo-s/1a/72/c6/0f/schlosspark-laxenburg.jpg",
        ],
        Radius: 500,
      },
      {
        Address: {
          AddressStr: "Kremsegger Strasse 59, Kremsmunster 4550 Austria",
          Latitude: "48.05449",
          Longitude: "14.1451",
        },
        Cost: 10,
        Description:
          "A fascinating museum exploring the history of work and technology.",
        Location: "47.992019,14.128902",
        Name: "Arbeitswelt Museum",
        Photos: [
          "https://media-cdn.tripadvisor.com/media/photo-s/0f/62/09/b6/photo6jpg.jpg",
          "https://media-cdn.tripadvisor.com/media/photo-s/09/da/19/aa/musikinstrumenten-museum.jpg",
          "https://media-cdn.tripadvisor.com/media/photo-s/1a/f2/66/da/schlossgarten.jpg",
          "https://media-cdn.tripadvisor.com/media/photo-s/1a/f2/66/ce/schloss.jpg",
          "https://media-cdn.tripadvisor.com/media/photo-s/1a/f2/66/cd/museum.jpg",
        ],
        Radius: 300,
      },
      {
        Address: {
          AddressStr: "Kremsmunster Austria",
          Latitude: "48.05225",
          Longitude: "14.12706",
        },
        Cost: 15,
        Description:
          "An impressive Benedictine monastery with a rich history and stunning architecture.",
        Location: "48.052923,14.132027",
        Name: "Kremsmünster Abbey",
        Photos: [
          "https://media-cdn.tripadvisor.com/media/photo-s/12/52/b4/79/stift-kremsmunster.jpg",
          "https://media-cdn.tripadvisor.com/media/photo-s/01/c6/3c/35/blick-von-kirchberg-auf.jpg",
        ],
        Radius: 400,
      },
    ],
    BudgetUSD: {
      Food: 30,
      Miscellaneous: 20,
    },
    Notes:
      "Ensure to check the train schedules in advance and consider purchasing tickets online to avoid queues.",
    Route: {
      RouteOverview:
        "Take a direct train from Vienna to Linz, offering scenic views of the Austrian countryside.",
      Transportation: ["train"],
      TravelTime: 2,
    },
  });*/

  function getCurrentDateTime(add_hours: number) {
    const now = new Date();

    now.setHours(now.getHours() + add_hours);
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const date = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${date}T${hours}:${minutes}`;
  }

  async function requestRecommendations(excludePrevious: boolean = false) {
    let query_url = SERVER_URL + "/find_route";

    const params = new URLSearchParams({
      transport: travelMode,
      starting_city: startCity.AddressStr,
      destination_city: destCity.AddressStr,
      excludeStartCityAttractions: (!includeStart).toString(),
      excludeDestCityAttractions: (!includeEnd).toString(),
      departure: startDateTime,
      arrival: endDateTime,
      interests: selectedInterests.toString(),
      number_people: selectedNumPeople.toString(),
      age: selectedAgeGroups.toString(),
    });

    if (excludePrevious && travelRoute) {
      const excluded = travelRoute.AttractionRecommendations.filter(
        (a) => !a.Unwanted
      ).map((a) => a.Name);

      const unwanted = travelRoute.AttractionRecommendations.filter(
        (a) => a.Unwanted
      ).map((a) => a.Name);

      params.append("excludeFollowingAttractions", excluded.join(","));
      params.append("unwantedAttractions", unwanted.join(","));
    }

    query_url += `?${params.toString()}`;

    console.log(query_url);

    setIsLoading(true);
    let responseJson = null;
    try {
      const response = await fetch(query_url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      responseJson = await response.json();
      console.log("ANS");
      console.log(responseJson);
    } catch (e: any) {
      console.log("Error in finding route!");
      console.error(e);
    }

    setIsLoading(false);
    return responseJson;
  }

  async function handleFindRoute() {
    setAreRecsFilled(false);
    const responseJson = await requestRecommendations();
    const updatedAttractions = responseJson.AttractionRecommendations.map(
      (attr: AttractionRecommendation) => ({
        ...attr,
        Unwanted: false,
      })
    );
    const updatedResponse = {
      ...responseJson,
      AttractionRecommendations: updatedAttractions,
    };
    setAttractions(updatedAttractions);
    try {
      setTravelRoute(updatedResponse);
      setAreRecsFilled(true);
    } catch (e: any) {
      console.error(e);
    }
  }

  async function handleExtendRoute() {
    if (!travelRoute) {
      handleFindRoute();
      return;
    }

    const responseJson = await requestRecommendations(true);

    try {
      const extendedAttractions = [
        ...attractions,
        ...responseJson.AttractionRecommendations.map(
          (attr: AttractionRecommendation) => ({
            ...attr,
            Unwanted: false,
          })
        ),
      ];

      console.log(extendedAttractions);

      const updatedResponse = {
        ...responseJson,
        AttractionRecommendations: extendedAttractions,
      };
      setAttractions(extendedAttractions);

      setTravelRoute(updatedResponse);
      setAreRecsFilled(true);
    } catch (e: any) {
      console.error(e);
    }
  }

  function addSecondsToTime(timeStr: string, secondsToAdd: number): string {
    const date = new Date(timeStr);

    date.setSeconds(date.getSeconds() + secondsToAdd);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  async function updateMinDuration() {
    setIsLoading(true);
    console.log("updating");
    let data = await getRoute(
      [
        [startCity.Longitude, startCity.Latitude],
        [destCity.Longitude, destCity.Latitude],
      ],
      travelMode as TravelMode
    );

    if (data == null) {
      handleClearFilters();
      alert("Error! No route exists");
      setIsLoading(false);
      return;
    }

    setMinDurationS(data.duration);
    console.log(addSecondsToTime(startDateTime, data.duration));
    setEndDateTime(addSecondsToTime(startDateTime, data.duration));
    setIsLoading(false);
  }

  function handleClearFilters() {
    setStartDateTime(getCurrentDateTime(1));
    setEndDateTime(getCurrentDateTime(5));
    setSelectedInterests(interests);
    setSelectedNumPeople(minNumPeople);
    setSelectedAgeGroups(ageGroups);
    setActiveSection(0);
    setTravelMode("driving");
    setMinDurationS(0);
  }

  return (
    <div className={isLoading ? "main_page no-click" : "main_page"}>
      <p style={{ color: "red" }}>
        Note: First query search can take about 2 minutes because of hosting
        service management of inactivity.
      </p>
      <h3>STEP 1</h3>
      <div
        className={"filter_section" + (activeSection != 0 ? " no-clicks" : "")}
      >
        <RouteModeSelector selectedMode={travelMode} onChange={setTravelMode} />
        <div className="btn_container">
          <button
            className="btn"
            onClick={() => {
              setActiveSection((prev) => prev + 1);
            }}
          >
            NEXT
          </button>
        </div>
      </div>
      <h3>STEP 2</h3>
      <div
        className={"filter_section" + (activeSection != 1 ? " no-clicks" : "")}
      >
        <div>
          <Autocomplete
            label="Starting city"
            inputValue={startCity}
            setInputValue={setStartCity}
            includeCity={includeStart}
            setIncludeCity={setIncludeStart}
          />
          <Autocomplete
            label="Destination city"
            inputValue={destCity}
            setInputValue={setDestCity}
            includeCity={includeEnd}
            setIncludeCity={setIncludeEnd}
          />
        </div>
        <div className="btn_container">
          <button
            className="btn"
            onClick={() => {
              if (startCity.AddressStr !== "" && destCity.AddressStr !== "") {
                setActiveSection((prev) => prev + 1);
                updateMinDuration();
              }
            }}
          >
            NEXT
          </button>
        </div>
      </div>
      <h3>STEP 3</h3>
      <div
        className={
          "filter_section" +
          (activeSection != 2 || isLoading ? " no-clicks" : "")
        }
      >
        <div>
          {minDurationS > 0 && (
            <h3 style={{ color: "green" }}>
              Min duration: {Math.floor(minDurationS / 3600)} h{" "}
              {Math.floor(((minDurationS % 3600) / 3600) * 60)} min
            </h3>
          )}
          <DateTimePicker
            startDateTime={startDateTime}
            setStartDateTime={setStartDateTime}
            endDateTime={endDateTime}
            setEndDateTime={setEndDateTime}
            minDuration={minDurationS}
          />
        </div>
        <div>
          <CheckboxSet
            selectedOptions={selectedInterests}
            setSelectedOptions={setSelectedInterests}
            options={interests}
            label={"Choose your interests"}
          />
          <CheckboxSet
            selectedOptions={selectedAgeGroups}
            setSelectedOptions={setSelectedAgeGroups}
            options={ageGroups}
            label={"Choose your age groups"}
          />
        </div>
        <div>
          <NumericInput
            value={selectedNumPeople}
            setValue={setSelectedNumPeople}
            minValue={minNumPeople}
            maxValue={maxNumPeople}
          />
        </div>
        <div className="btn_container">
          <button className="btn" onClick={() => handleFindRoute()}>
            FIND ROUTE
          </button>
        </div>
      </div>

      {areRecsFilled && (
        <>
          <TravelRouteComponent
            attractions={attractions}
            setAttractions={setAttractions}
            travelRoute={travelRoute}
            startCity={startCity}
            endCity={destCity}
            travelMode={travelMode}
          />

          <button
            className={"btn" + (isLoading ? " no-clicks" : "")}
            onClick={() => handleExtendRoute()}
          >
            SEARCH MORE
          </button>
        </>
      )}
      <div>{isLoading && <BufferingSign />}</div>
    </div>
  );
}

export default App;
