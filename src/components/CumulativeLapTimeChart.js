import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';


import { convertToSeconds } from '../helpers/convertToSeconds';



const CumulativeLapTimeChart = ({ season, race }) => {
    const [chartData, setChartData] = useState({ datasets: [], labels: [] });
    const [isRaceDataAvailable, setIsRaceDataAvailable] = useState(true); // State to track data availability
    const [raceResults, setRaceResults] = useState([]);
  
    // Function to fetch race results if lap times are not available
    const fetchRaceResults = async () => {
      const response = await axios.get(`http://ergast.com/api/f1/${season}/${race}/results.json`);
      return response.data.MRData.RaceTable.Races[0]?.Results.map((result) => ({
        position: parseInt(result.position, 10),
        driverId: result.Driver.driverId,
        positionChange: result.grid - parseInt(result.position, 10), // Calculate position change
        finished: result.status !== "Finished" ? result.status : null // Determine if the driver finished
      }));
    };


  
    useEffect(() => {
        if (season < 1993) {
            // For seasons before 1993, only show race results
            setIsRaceDataAvailable(false);
            fetchRaceResults().then(results => {
              setRaceResults(results);
            });
          } else if (season >= 1993 && season <= 1996) {
            setIsRaceDataAvailable(false);
            fetchRaceResults().then(results => {
                setRaceResults(results); // Set the race results state
            });
          } else {
    
            setIsRaceDataAvailable(true);
            const fetchQualifyingPositions = async () => {
            try {
              const response = await axios.get(`http://ergast.com/api/f1/${season}/${race}/qualifying.json`);
              const qualifyingResults = response.data.MRData.RaceTable.Races[0]?.QualifyingResults;

              // Check if QualifyingResults is defined and has length
              if (qualifyingResults && qualifyingResults.length > 0) {
                // Return an array of qualifying positions and the driverId associated with each position
                return qualifyingResults.map((result) => {
                  return {
                    position: parseInt(result.position, 10), // Convert position to a number
                    driverId: result.Driver.driverId
                  };
                });
              } else {
                // If there are no qualifying results, return an array with all drivers having position 0
                console.warn('No qualifying results found for this race, setting all positions to 0:', response.data);
                const driversResponse = await axios.get(`http://ergast.com/api/f1/${season}/drivers.json`);
                const drivers = driversResponse.data.MRData.DriverTable.Drivers;
                return drivers.map((driver) => {
                  return {
                    position: 0, // Set position to 0
                    driverId: driver.driverId
                  };
                });
              }
            } catch (error) {
              console.error("Error fetching qualifying results:", error);
              return [];
            }
            };

          
  
            const fetchLapTimes = async () => {
            // Fetch the starting grid positions first
            const startingGrid = await fetchQualifyingPositions();
            
            // Prepare the starting grid positions
            const gridPositions = startingGrid.reduce((acc, curr) => {
                acc[curr.driverId] = parseInt(curr.position, 10); // parse the position to integer
                return acc;
            }, {});

            // Then fetch lap timing data for each driver
            const { data } = await axios.get(`https://ergast.com/api/f1/${season}/${race}/laps.json?limit=1000`);
            const lapTimesData = data.MRData.RaceTable.Races[0]?.Laps;

            if (!lapTimesData) {
                setChartData({ datasets: [], labels: [] });
                return;
            }

            

          

            const cumulativeTimes = {};
            lapTimesData.forEach((lap, lapIndex) => {
                lap.Timings.forEach(timing => {
                  const driverId = timing.driverId;
                  const timeInSeconds = convertToSeconds(timing.time);
                  if (!cumulativeTimes[driverId]) {
                    cumulativeTimes[driverId] = [];
                  }
                  cumulativeTimes[driverId][lapIndex] = (cumulativeTimes[driverId][lapIndex - 1] || 0) + timeInSeconds;
                });
              });

              const labels = lapTimesData.map((_, index) => index+1); // Lap labels should start from 0
              const datasets = startingGrid.map(driver => {
                const driverId = driver.driverId;
                const driverTimes = cumulativeTimes[driverId] || [];

                const data = driverTimes.map((time, lapIndex) => {
                  const lapPositions = calculatePositions(cumulativeTimes, lapIndex);
                  const driverLapPosition = lapPositions.find(pos => pos.driverId === driverId)?.position || startingGrid.length;
                  return { x: lapIndex + 1, y: driverLapPosition };
                });

                return {
                  label: driverId,
                  data: data,
                  borderColor: getRandomColor(),
                  borderWidth: 1,
                  pointRadius: 2,
                  lineTension: 0.1,
                };
              });

              setChartData({ labels, datasets });
            };

            fetchLapTimes();
        }
  }, [season, race]);

  if (!isRaceDataAvailable) {
     // Render race results view when no lap data is available
     return (
        <div>
          <h2>Race Results</h2>
          {raceResults.map(result => (
            <div key={result.driverId}>
              {result.driverId}: Position {result.position} {result.positionChange > 0 ? `(+${result.positionChange})` : result.positionChange < 0 ? `(${result.positionChange})` : ''} {result.finished || ''}
            </div>
          ))}
        </div>
      );
  } else {

  return (
    <div>
      <h2>Story of the Race</h2>
      <Line data={chartData} options={{
        responsive: true,
        scales: {
          x: {
            title: {
              display: true,
              text: 'Lap Number'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Position'
            },
            reversed: true // Ensure positions are displayed correctly
          }
        }
      }} />
    </div>
  );
}
};

export default CumulativeLapTimeChart;

// Utility function to generate a random color
function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

const calculatePositions = (cumulativeTimes, lapIndex) => {
    // Create an array of [driverId, cumulativeTime] tuples
    const lapTimes = Object.keys(cumulativeTimes).map(driverId => ({
      driverId,
      time: cumulativeTimes[driverId][lapIndex] || Number.MAX_VALUE, // If no time, set a very high time
    }));
  
    // Sort the drivers based on the cumulative time at the given lapIndex
    return lapTimes
      .sort((a, b) => a.time - b.time)
      .map((driver, index) => ({
        driverId: driver.driverId,
        position: index + 1, // Position is index + 1 because array is 0-indexed
      }));
  };