import React, { useState } from "react";
import styles from "./dbstyles.module.css";

interface RadioButtonSetProps {
  textLabel: string;
  selectedOption: string;
  setSelectedOption: (value: string) => void;
  options: string[];
}

function RadioButtonSet({
  textLabel,
  selectedOption,
  setSelectedOption,
  options,
}: RadioButtonSetProps) {
  const handleRadioButtonChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSelectedOption(event.target.value);
  };

  return (
    <div className={styles.filter}>
      <label>{textLabel}</label>
      <div className={styles.dropdown_radiobutton}>
        <button id="filter2">{selectedOption}</button>
        <div className={styles.dropdown_content}>
          {options.map((option) => (
            <div key={option}>
              <label>
                <input
                  type="radio"
                  value={option}
                  checked={selectedOption === option}
                  onChange={handleRadioButtonChange}
                />
                {option}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default RadioButtonSet;
