// src/components/student/QuizTimer.jsx
import { useState, useEffect, useRef } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

const QuizTimer = ({ initialTime, onTimeUpdate, onTimeUp }) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const intervalRef = useRef(null);

  useEffect(() => {
    // Start the timer
    intervalRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        const newTime = prevTime - 1;
        
        if (onTimeUpdate) {
          onTimeUpdate(newTime);
        }

        if (newTime <= 0) {
          clearInterval(intervalRef.current);
          if (onTimeUp) {
            onTimeUp();
          }
          return 0;
        }
        
        return newTime;
      });
    }, 1000);

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes
        .toString()
        .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isLowTime = timeLeft <= 300; // 5 minutes
  const isCriticalTime = timeLeft <= 60; // 1 minute

  return (
    <div
      className={`flex items-center px-4 py-2 rounded-lg font-semibold transition ${
        isCriticalTime
          ? 'bg-red-100 text-red-700 animate-pulse'
          : isLowTime
          ? 'bg-orange-100 text-orange-700'
          : 'bg-blue-100 text-blue-700'
      }`}
    >
      {isCriticalTime ? (
        <AlertTriangle size={20} className="mr-2" />
      ) : (
        <Clock size={20} className="mr-2" />
      )}
      <span className="text-lg">{formatTime(timeLeft)}</span>
    </div>
  );
};

export default QuizTimer;