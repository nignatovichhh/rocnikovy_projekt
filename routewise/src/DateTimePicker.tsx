import React, { useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-time-picker/dist/TimePicker.css';
import './styles/App.css';

interface DateTimePickerProps {
    dateTime: string;
    setDateTime: (value: string) => void;
    textLabel: string;
}

const DateTimePicker = ({ dateTime, setDateTime, textLabel }: DateTimePickerProps) => {


    const handleDateTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDateTime(event.target.value);
    };

    return (
        <div className="filter">
            <label>
                {textLabel}
            </label>
            <input type="datetime-local" value={dateTime} onChange={handleDateTimeChange} style={{ height: '30px', border: '1px solid #BBBFCA' }} />

        </div>
    );
};

export default DateTimePicker;
