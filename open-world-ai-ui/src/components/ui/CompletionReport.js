import React from 'react';
import './CompletionReport.css';

const formatTime = (time) => {
  const minutes = Math.floor(time / 60000);
  const seconds = Math.floor((time % 60000) / 1000);
  const milliseconds = Math.floor((time % 1000) / 10);
  return `${minutes}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
};

const CompletionReport = ({ finalTime, checkpointTimes, onClose }) => {
  return (
    <div className="completion-report-overlay">
      <div className="completion-report">
        <div className="report-header">
          <h2>🎉 Challenge Complete! 🎉</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="report-content">
          <div className="time-section">
            <div className="final-time">
              <h3>🏁 Final Time</h3>
              <div className="time-value">{formatTime(finalTime)}</div>
            </div>
          </div>

          <div className="checkpoints-section">
            <h3>🚩 Checkpoint Times</h3>
            <div className="checkpoint-list">
              {Object.entries(checkpointTimes).map(([checkpoint, time], index) => (
                <div key={checkpoint} className="checkpoint-item">
                  <span className="checkpoint-label">Checkpoint {parseInt(checkpoint) + 1}</span>
                  <span className="checkpoint-time">{formatTime(time)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="report-footer">
          <button className="play-again-button" onClick={onClose}>
            Play Again! 🎮
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompletionReport;
