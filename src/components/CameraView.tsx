import { useState, useEffect, useRef } from 'react';
import './CameraView.css';

interface CameraViewProps {
  onClose?: () => void;
}

const CameraView: React.FC<CameraViewProps> = ({ onClose }) => {
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Get available camera devices
  useEffect(() => {
    async function getDevices() {
      try {
        // Request permission first by getting a stream
        const initialStream = await navigator.mediaDevices.getUserMedia({ video: true });
        initialStream.getTracks().forEach(track => track.stop()); // Stop initial stream
        
        // Now get all video devices
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        console.log(devices)
        setDevices(videoDevices);
        
        // Select first device by default if available
        if (videoDevices.length > 0 && !selectedDeviceId) {
          setSelectedDeviceId(videoDevices[0].deviceId);
        }
      } catch (error) {
        console.error('Error accessing camera devices:', error);
      }
    }
    
    getDevices();
  }, []);

  // Start stream when device is selected
  useEffect(() => {
    async function startStream() {
      if (!selectedDeviceId) return;
      
      try {
        // Stop previous stream if exists
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
        
        // Start new stream
        const newStream = await navigator.mediaDevices.getUserMedia({
          video: { 
            deviceId: { exact: selectedDeviceId }, 
            facingMode: 'user',
            width: { min: 1920, max: 1920 },
            frameRate: { min: 30, max: 60 },
          }
        });
        
        setStream(newStream);
        
        // Connect stream to video element
        if (videoRef.current) {
          videoRef.current.srcObject = newStream;
        }
      } catch (error) {
        console.error('Error starting camera stream:', error);
      }
    }
    
    startStream();
    
    // Cleanup function
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [selectedDeviceId]);

  // Handle device selection change
  const handleDeviceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDeviceId(event.target.value);
  };

  return (
    <div className="camera-view">
      <div className="camera-controls">
        <select 
          value={selectedDeviceId} 
          onChange={handleDeviceChange}
          className="camera-select"
        >
          {devices.length === 0 && (
            <option value="">No cameras found</option>
          )}
          {devices.map(device => (
            <option key={device.deviceId} value={device.deviceId}>
              {device.label || `Camera ${devices.indexOf(device) + 1}`}
            </option>
          ))}
        </select>
        {onClose && (
          <button onClick={onClose} className="close-button">
            Close Camera
          </button>
        )}
      </div>
      <video 
        ref={videoRef} 
        autoPlay 
        playsInline 
        className="camera-video" 
      />
    </div>
  );
};

export default CameraView; 