// components/QualifyingResults.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const QualifyingResults = ({ season, race }) => {
    const [qualifyingResults, setQualifyingResults] = useState([]);
  
    useEffect(() => {
      const fetchQualifyingResults = async () => {
        try {
          const { data } = await axios.get(`http://ergast.com/api/f1/${season}/${race}/qualifying.json`);
          // Check if the races array and the qualifying results exist
          if (data.MRData.RaceTable.Races.length > 0 && data.MRData.RaceTable.Races[0].QualifyingResults) {
            setQualifyingResults(data.MRData.RaceTable.Races[0].QualifyingResults);
          } else {
            // Handle the case where there are no qualifying results
            console.warn('No qualifying results found for this race.');
            setQualifyingResults([]);
          }
        } catch (error) {
          console.error('Error fetching qualifying results:', error);
          // Handle the error state
        }
      };
  
      fetchQualifyingResults();
    }, [season, race]);
  
    return (
      <div>
          {qualifyingResults.length > 0 ? (
              qualifyingResults.map(result => (
                  <div key={result.position}>
                      {result.position}. {result.Driver.familyName} - {result.Q3 || result.Q2 || result.Q1}
                  </div>
              ))
          ) : (
              <p>No qualifying results available for this race.</p>
          )}
      </div>
  );
};

  
  export default QualifyingResults;
  