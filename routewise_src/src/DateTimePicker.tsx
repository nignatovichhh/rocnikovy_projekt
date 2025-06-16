import React, { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import "react-time-picker/dist/TimePicker.css";
import "./styles/App.css";

interface DateTimePickerProps {
  startDateTime: string;
  setStartDateTime: (value: string) => void;
  endDateTime: string;
  setEndDateTime: (value: string) => void;
  minDuration: number;
}

const DateTimePicker = ({
  startDateTime,
  setStartDateTime,
  endDateTime,
  setEndDateTime,
  minDuration,
}: DateTimePickerProps) => {
  const handleStartDateTimeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setStartDateTime(event.target.value);
  };
  const handleEndDateTimeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setEndDateTime(event.target.value);
  };

  return (
    <div className="filter">
      <label>Starting date</label>
      <input
        type="datetime-local"
        value={startDateTime}
        onChange={handleStartDateTimeChange}
        style={{ height: "30px", border: "1px solid #BBBFCA" }}
      />
      <label>Ending date</label>
      <input
        type="datetime-local"
        value={endDateTime}
        onChange={handleEndDateTimeChange}
        style={{ height: "30px", border: "1px solid #BBBFCA" }}
      />
    </div>
  );
};

export default DateTimePicker;
