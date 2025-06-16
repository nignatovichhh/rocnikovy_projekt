import React from "react";

export type TravelMode = "driving" | "walking" | "cycling";

interface RouteModeSelectorProps {
  selectedMode: TravelMode;
  onChange: (mode: TravelMode) => void;
}

const RouteModeSelector: React.FC<RouteModeSelectorProps> = ({
  selectedMode,
  onChange,
}) => {
  return (
    <div style={{ marginBottom: "1rem" }}>
      <label>
        <strong>Transport: </strong>
      </label>
      <select
        value={selectedMode}
        onChange={(e) => onChange(e.target.value as TravelMode)}
        style={{ padding: "6px", marginLeft: "8px" }}
      >
        <option value="" disabled hidden>
          Choose...
        </option>
        <option value="driving">🚗 Driving</option>
        <option value="walking">🚶 Walking</option>
        <option value="cycling">🚴 Cycling</option>
      </select>
    </div>
  );
};

export default RouteModeSelector;
