import { useState, useEffect } from 'react';
import './Clock.css';
import { formatDate } from '../../utils/helpers';

interface ClockProps {
  showSeconds?: boolean;
  use24HourFormat?: boolean;
  className?: string;
}

const Clock: React.FC<ClockProps> = ({ 
  showSeconds = false, 
  use24HourFormat = false,
  className = ''
}) => {
  const [date, setDate] = useState(new Date());
  
  useEffect(() => {
    // Update the clock every second
    const timerId = setInterval(() => {
      setDate(new Date());
    }, 1000);
    
    // Clean up the interval on component unmount
    return () => {
      clearInterval(timerId);
    };
  }, []);
  
  // Format the time
  const formatTime = () => {
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    
    let period = '';
    
    // Handle 12-hour format
    if (!use24HourFormat) {
      period = hours >= 12 ? 'pm' : 'am';
      hours = hours % 12;
      hours = hours ? hours : 12; // Convert 0 to 12 for 12 AM
    }
    
    const hoursStr = hours.toString().padStart(2, '0');
    
    return {
      hours: hoursStr,
      minutes,
      seconds,
      period
    };
  };
  
  const { hours, minutes, seconds, period } = formatTime();
  
  return (
    <div className={`clock ${className}`}>
      <div className="clock-time">
        <p className="hours">{hours}</p>
        <p className="time-separator">:</p>
        <p className="minutes">{minutes}</p>
        {showSeconds && (
          <>
            <p className="time-separator">:</p>
            <p className="seconds">{seconds}</p>
          </>
        )}
        {!use24HourFormat && (
          <p className="period">{period}</p>
        )}
      </div>
      <div className="clock-date">
        {formatDate(date)}
      </div>
    </div>
  );
};

export default Clock; 