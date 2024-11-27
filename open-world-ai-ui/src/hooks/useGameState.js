import { useState, useCallback } from 'react';

const useGameState = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [startBeacon, setStartBeacon] = useState(true);
  const [endBeacon, setEndBeacon] = useState(true);
  const [checkpointsPassed, setCheckpointsPassed] = useState(new Set());

  const handleCheckpointPass = useCallback((checkpointNumber) => {
    setCheckpointsPassed(prev => new Set([...prev, checkpointNumber]));
  }, []);

  const handleStartPoint = useCallback(() => {
    if (!isRunning && startBeacon) {
      setIsRunning(true);
      setStartBeacon(false);
      setEndBeacon(true); // Ensure end beacon is visible when starting
      setCheckpointsPassed(new Set()); // Reset checkpoints when starting
    }
  }, [isRunning, startBeacon]);

  const handleEndPoint = useCallback(() => {
    if (isRunning && endBeacon) {
      setIsRunning(false);
      setEndBeacon(false);
      // Reset state after showing completion
      setTimeout(() => {
        setStartBeacon(true);
        setEndBeacon(true);
      }, 2000);
    }
  }, [isRunning, endBeacon]);

  const handleStopwatchReset = useCallback((finalTime) => {
    if (finalTime > 0) {
      const minutes = Math.floor(finalTime / 60000);
      const seconds = Math.floor((finalTime % 60000) / 1000);
      const milliseconds = Math.floor((finalTime % 1000) / 10);
      console.log(`Final Time: ${minutes}:${seconds}.${milliseconds}`);
    }
  }, []);

  return {
    isRunning,
    startBeacon,
    endBeacon,
    checkpointsPassed,
    handleStartPoint,
    handleEndPoint,
    handleCheckpointPass,
    handleStopwatchReset
  };
};

export default useGameState;
