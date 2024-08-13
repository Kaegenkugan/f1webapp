// src/components/DriverSelector.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DriverSelector = ({ season, race, onSelectDriver }) => {
  const [drivers, setDrivers] = useState([]);

  useEffect(() => {
    if (season && race) {
      const fetchDrivers = async () => {
        const response = await axios.get(`http://ergast.com/api/f1/${season}/${race}/drivers.json`);
        setDrivers(response.data.MRData.DriverTable.Drivers);
      };

      fetchDrivers();
    }
  }, [season, race]);

  return (
    <select onChange={(e) => onSelectDriver(e.target.value)}>
      {drivers.map((driver) => (
        <option key={driver.driverId} value={driver.driverId}>{driver.givenName} {driver.familyName}</option>
      ))}
    </select>
  );
};

export default DriverSelector;
