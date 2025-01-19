import React, { useState, ChangeEvent } from 'react';
import "./styles/App.css"

interface AutocompleteProps {
    label: string;
    inputValue: string;
    setInputValue: (inputValue: string) => void;
    options: string[];
}

const Autocomplete = ({ label, inputValue, setInputValue, options }: AutocompleteProps) => {
    const [filteredOptions, setFilteredOptions] = useState<string[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setInputValue(value);

        if (value) {
            const filtered = options.filter(option =>
                option.toLowerCase().startsWith(value.toLowerCase())
            );
            setFilteredOptions(filtered);
            setShowDropdown(true);
        } else {
            setShowDropdown(false);
        }
    };

    const handleOptionClick = (option: string) => {
        setInputValue(option);
        setShowDropdown(false);
    };

    return (
        <div className="filter">
            <label>{label}</label>
            <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                placeholder="Type to search..."
            />

            {
                showDropdown && filteredOptions.length > 0 && (
                    <ul
                        style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            right: 0,
                            background: '#fff',
                            border: '1px solid #ccc',
                            margin: 0,
                            padding: 0,
                            listStyleType: 'none',
                            maxHeight: '150px',
                            overflowY: 'auto',
                        }}
                    >
                        {filteredOptions.map(option => (
                            <li
                                key={option}
                                onClick={() => handleOptionClick(option)}
                            >
                                {option}
                            </li>
                        ))}
                    </ul>
                )
            }
        </div >
    );
};

export default Autocomplete;
