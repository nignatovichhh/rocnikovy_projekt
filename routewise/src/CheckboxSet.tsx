import React, { useState } from 'react';
import "./styles/App.css"
import "./styles/CheckboxSet.css"

interface CheckboxSetProps {
    selectedOptions: string[];
    setSelectedOptions: (value: string[]) => void;
    options: string[];
    label: string;
}

function CheckboxSet({ selectedOptions, setSelectedOptions, options, label }: CheckboxSetProps) {

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = event.target;
        const prev = selectedOptions;
        setSelectedOptions(checked ? [...prev, value] : prev.filter((option) => option !== value)
        );
    };

    return (
        <div className="filter">
            <label>{label}</label>
            <div className="dropdown_checkbox">
                <button id="filter2">Filter</button>
                <div className="dropdown_content">
                    {options.map((option, index) => (

                        <div key={index}>
                            <label>
                                <input
                                    type="checkbox"
                                    value={option}
                                    checked={selectedOptions.includes(option)}
                                    onChange={handleCheckboxChange}
                                />
                                {option}
                            </label>
                        </div>
                    ))}
                </div>
            </div>
        </div >
    );
};

export default CheckboxSet;