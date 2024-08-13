// src/components/RaceSelector.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RaceSelector = ({ season, onSelectRace }) => {
  const [races, setRaces] = useState([]);

  useEffect(() => {
    if (season) {
      const fetchRaces = async () => {
        const response = await axios.get(`http://ergast.com/api/f1/${season}.json`);
        setRaces(response.data.MRData.RaceTable.Races);
      };

      fetchRaces();
    }
  }, [season]);

  return (
    <select onChange={(e) => onSelectRace(e.target.value)}>
      {races.map((race, index) => (
        <option key={index} value={race.round}>{race.raceName}</option>
      ))}
    </select>
  );
};

export default RaceSelector;
