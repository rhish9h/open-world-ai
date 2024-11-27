import React, { useState, useEffect } from 'react';
import styles from './Stopwatch.module.css';

function Stopwatch({ isRunning, onReset }) {
  const [time, setTime] = useState(0);

  useEffect(() => {
    let intervalId;

    if (isRunning) {
      intervalId = setInterval(() => {
        setTime(prevTime => prevTime + 10); // Update every 10ms for smoother display
      }, 10);
    } else if (!isRunning && time !== 0) {
      clearInterval(intervalId);
    }

    return () => clearInterval(intervalId);
  }, [isRunning]);

  // Reset function
  useEffect(() => {
    if (!isRunning && onReset) {
      const finalTime = time;
      setTime(0);
      onReset(finalTime);
    }
  }, [isRunning, onReset]);

  // Format time to mm:ss:ms
  const formatTime = () => {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    const milliseconds = Math.floor((time % 1000) / 10);

    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={styles.stopwatchContainer}>
      <div className={styles.label}>Time</div>
      <div className={styles.time}>{formatTime()}</div>
    </div>
  );
}

export default Stopwatch;
