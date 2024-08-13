// helpers/convertToSeconds.js

export const convertToSeconds = (timeString) => {
    // Convert time formatted as "M:SS.sss" to seconds
    const [mins, secs] = timeString.split(':');
    return parseFloat(mins) * 60 + parseFloat(secs);
  };
  