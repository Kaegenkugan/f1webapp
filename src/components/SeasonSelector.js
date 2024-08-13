// src/components/SeasonSelector.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SeasonSelector = ({ onSelectSeason }) => {
  const [seasons, setSeasons] = useState([]);

  useEffect(() => {
    
    const fetchSeasons = async () => {
      const response = await axios.get('http://ergast.com/api/f1/seasons.json?limit=100');
      setSeasons(response.data.MRData.SeasonTable.Seasons);
    };

    /*
    seasons is the current state variable that will hold the data (in this case, an array of F1 seasons).
setSeasons is the function that you call when you want to update the seasons state. When setSeasons is called with a new value, the component will re-render, and seasons will contain the new value.
    
    */

    fetchSeasons();
  }, []);

  return (
    <select onChange={(e) => onSelectSeason(e.target.value)}>
      {seasons.map((season) => (
        <option key={season.season} value={season.season}>{season.season}</option>
      ))}
    </select>
  );
};

export default SeasonSelector;
