import React, { useState } from "react";
import "./styles/App.css"

interface NumericInputProps {
    value: number;
    setValue: (value: number) => void;
    minValue: number;
    maxValue: number;
}

const NumericInput = ({ value, setValue, minValue, maxValue }: NumericInputProps) => {

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = parseInt(event.target.value, 10);
        if (!isNaN(inputValue) && inputValue >= 1 && inputValue <= 10) {
            setValue(inputValue);
        } else {
            setValue(NaN);
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "ArrowUp") {
            setValue(Math.min(value + 1, maxValue));
        } else if (event.key === "ArrowDown") {
            setValue(Math.min(value - 1, minValue));
        }
    };

    const handleBlur = () => {
        if (isNaN(value)) {
            setValue(minValue);
        }
    };

    return (
        <div className="filter">
            <label>Number of People</label>
            <input
                type="number"
                value={isNaN(value) ? "" : value} // Отображаем пустую строку, если значение NaN
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                onBlur={handleBlur}
                min={1}
                max={10}
                step={1}
                style={{ width: "50px", height: "30px", textAlign: "center" }}
            />
        </div>
    );
};

export default NumericInput;

