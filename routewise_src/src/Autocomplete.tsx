import React, { useState, ChangeEvent } from "react";
import "./styles/App.css";
import { AddressInfo } from "./App";
import GeocoderInput from "./GeocoderInput";

interface AutocompleteProps {
  label: string;
  inputValue: AddressInfo;
  setInputValue: (inputValue: AddressInfo) => void;
  includeCity: boolean;
  setIncludeCity: React.Dispatch<React.SetStateAction<boolean>>;
}

const Autocomplete = ({
  label,
  inputValue,
  setInputValue,
  includeCity,
  setIncludeCity,
}: AutocompleteProps) => {
  return (
    <div className="filter">
      <div>
        <label>{label}</label>
        <input
          type="checkbox"
          checked={includeCity}
          onChange={() => setIncludeCity((prev) => !prev)}
          title="Include attractions from the following city"
        />
      </div>
      <GeocoderInput inputCity={inputValue} onSelect={setInputValue} />
    </div>
  );
};

export default Autocomplete;
