import React, { useState, useEffect } from "react";
import { AddressInfo } from "./App";

const MAPBOX_TOKEN =
  "pk.eyJ1IjoiaWhuYXRvdmljaDEiLCJhIjoiY202M3JiaDN6MTV2dzJqc2YyZmUzcHNldyJ9.B6Z-eBKtkHJ77nb4iU2XCA";

interface Suggestion {
  place_name: string;
  center: [number, number];
}

const GeocoderInput = ({
  inputCity,
  onSelect,
}: {
  inputCity: AddressInfo;
  onSelect: (suggestion: AddressInfo) => void;
}) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [firstRequest, setFirstRequest] = useState<boolean>(true);

  useEffect(() => {
    setQuery(inputCity.AddressStr);
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (firstRequest) {
        setFirstRequest(false);
        return;
      }
      if (query.length < 3) return;

      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          query
        )}.json?access_token=${MAPBOX_TOKEN}&autocomplete=true&limit=5`
      );
      const data = await response.json();
      console.log("recs:");
      console.log(data);
      setSuggestions(data.features);
      setShowDropdown(true);
    };

    const timeout = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeout);
  }, [query]);

  const handleSelect = (s: Suggestion) => {
    setQuery(s.place_name);
    onSelect({
      Latitude: s.center[1].toString(),
      Longitude: s.center[0].toString(),
      AddressStr: s.place_name,
    });
  };

  return (
    <div style={{ position: "relative", marginBottom: "1rem" }}>
      <input
        type="text"
        placeholder="Start typing a location..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => {
          if (suggestions.length > 0) setShowDropdown(true);
        }}
        onBlur={() => {
          setQuery(inputCity.AddressStr);
          setFirstRequest(true);
          setTimeout(() => {
            setShowDropdown(false);
          }, 100); // delay to allow click
        }}
        style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
      />
      {showDropdown && suggestions.length > 0 && (
        <ul
          style={{
            position: "absolute",
            zIndex: 1000,
            top: "100%",
            left: 0,
            right: 0,
            background: "white",
            border: "1px solid #ccc",
            borderTop: "none",
            maxHeight: "200px",
            overflowY: "auto",
            listStyle: "none",
            padding: 0,
            margin: 0,
          }}
        >
          {suggestions.map((s, index) => (
            <li
              key={index}
              onClick={() => handleSelect(s)}
              style={{
                padding: "8px",
                cursor: "pointer",
                borderBottom: "1px solid #eee",
              }}
              onMouseDown={(e) => e.preventDefault()} // prevents blur
            >
              {s.place_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GeocoderInput;
