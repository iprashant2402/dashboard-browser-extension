import { useState, useEffect } from 'react';
import './Clock.css';

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
      period = hours >= 12 ? 'PM' : 'AM';
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
  
  // Format the date
  const formatDate = () => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    
    return date.toLocaleDateString(undefined, options);
  };
  
  const { hours, minutes, seconds, period } = formatTime();
  
  return (
    <div className={`clock ${className}`}>
      <div className="clock-time">
        <span className="hours">{hours}</span>
        <span className="time-separator">:</span>
        <span className="minutes">{minutes}</span>
        {showSeconds && (
          <>
            <span className="time-separator">:</span>
            <span className="seconds">{seconds}</span>
          </>
        )}
        {!use24HourFormat && (
          <span className="period">{period}</span>
        )}
      </div>
      <div className="clock-date">
        {formatDate()}
      </div>
    </div>
  );
};

export default Clock; 