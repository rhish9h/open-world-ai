import { useState, useCallback } from 'react';

const useGameState = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [startBeacon, setStartBeacon] = useState(true);
  const [endBeacon, setEndBeacon] = useState(true);
  const [checkpointsPassed, setCheckpointsPassed] = useState(new Set());
  const [checkpointTimes, setCheckpointTimes] = useState({});
  const [finalTime, setFinalTime] = useState(0);
  const [showReport, setShowReport] = useState(false);
  const [startTime, setStartTime] = useState(0);

  const handleCheckpointPass = useCallback((checkpointNumber) => {
    if (isRunning) {
      const currentTime = Date.now() - startTime;
      setCheckpointTimes(prev => ({
        ...prev,
        [checkpointNumber]: currentTime
      }));
      setCheckpointsPassed(prev => new Set([...prev, checkpointNumber]));
    }
  }, [isRunning, startTime]);

  const handleStartPoint = useCallback(() => {
    if (!isRunning && startBeacon) {
      setIsRunning(true);
      setStartBeacon(false);
      setEndBeacon(true);
      setCheckpointsPassed(new Set());
      setCheckpointTimes({});
      setStartTime(Date.now());
      setShowReport(false);
    }
  }, [isRunning, startBeacon]);

  const handleEndPoint = useCallback(() => {
    if (isRunning && endBeacon) {
      const finalTime = Date.now() - startTime;
      setFinalTime(finalTime);
      setIsRunning(false);
      setEndBeacon(false);
      setShowReport(true);
      
      // Reset state after showing completion
      setTimeout(() => {
        setStartBeacon(true);
        setEndBeacon(true);
      }, 2000);
    }
  }, [isRunning, endBeacon, startTime]);

  const handleCloseReport = useCallback(() => {
    setShowReport(false);
    setStartBeacon(true);
    setEndBeacon(true);
  }, []);

  return {
    isRunning,
    startBeacon,
    endBeacon,
    checkpointsPassed,
    checkpointTimes,
    finalTime,
    showReport,
    handleStartPoint,
    handleEndPoint,
    handleCheckpointPass,
    handleCloseReport
  };
};

export default useGameState;
