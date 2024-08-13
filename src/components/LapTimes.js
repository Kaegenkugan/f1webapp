// src/components/LapTimes.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LapTimes = ({ season, race, driver }) => {
  const [lapTimes, setLapTimes] = useState([]);

  useEffect(() => {
    if (season && race && driver) {
      const fetchLapTimes = async () => {
        const response = await axios.get(`http://ergast.com/api/f1/${season}/${race}/drivers/${driver}/laps.json?limit=1000`);
        setLapTimes(response.data.MRData.RaceTable.Races[0]?.Laps || []);
      };

      fetchLapTimes();
    }
  }, [season, race, driver]);

  return (
    <div>
      <h3>Lap Times for {driver}</h3>
      {lapTimes.length > 0 ? (
        lapTimes.map((lap, index) => (
          <div key={index}>
            <p>Lap {lap.number}</p>
            {lap.Timings.map((timing, idx) => (
              <p key={idx}>{timing.driverId}: {timing.time}</p>
            ))}
          </div>
        ))
      ) : (
        <p>No lap times available.</p>
      )}
    </div>
  );
};

export default LapTimes;
