// src/components/App.js

import React, { useState } from 'react';
import SeasonSelector from './SeasonSelector';
import RaceSelector from './RaceSelector';
import DriverSelector from './DriverSelector';
import LapTimes from './LapTimes';
import './App.css';

function App() {
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [selectedRace, setSelectedRace] = useState(null);
  const [selectedDriver, setSelectedDriver] = useState(null);

  return (
    <div className="App">
      <h1>F1 Lap Times App</h1>
      <SeasonSelector onSelectSeason={setSelectedSeason} />
      {selectedSeason && <RaceSelector season={selectedSeason} onSelectRace={setSelectedRace} />}
      {selectedSeason && selectedRace && <DriverSelector season={selectedSeason} race={selectedRace} onSelectDriver={setSelectedDriver} />}
      {selectedSeason && selectedRace && selectedDriver && <LapTimes season={selectedSeason} race={selectedRace} driver={selectedDriver} />}
    </div>
  );
}

export default App;
