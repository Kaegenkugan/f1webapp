// App.js

import React, { useState } from 'react';
import SeasonSelector from './components/SeasonSelector';
import RaceSelector from './components/RaceSelector';
import QualifyingResults from './components/QualifyingResults';
import CumulativeLapTimeChart from './components/CumulativeLapTimeChart';
import './visuals/App.css';

function App() {
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [selectedRace, setSelectedRace] = useState(null);

  return (
    <div className="App">
      <h1>F1 Race Data</h1>
      <SeasonSelector onSelectSeason={setSelectedSeason} />
      {selectedSeason && <RaceSelector season={selectedSeason} onSelectRace={setSelectedRace} />}
      {selectedSeason && selectedRace && (
        <>
          <QualifyingResults season={selectedSeason} race={selectedRace} />
          <CumulativeLapTimeChart season={selectedSeason} race={selectedRace} />
        </>
      )}
    </div>
  );
}

export default App;
