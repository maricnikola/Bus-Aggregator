import { useEffect, useState } from 'react';
import { Departure } from '../models/Departure';

const useWebSocket = (url: string) => {
  const [departure, setData] = useState<Departure | null>(null);

  useEffect(() => {
    const websocket: WebSocket = new WebSocket(url);

    websocket.onopen = () => {
      console.log('WebSocket connected');
    };

    websocket.onmessage = (event) => {
      const receivedData = JSON.parse(event.data);
      setData(receivedData);
    };

    websocket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    websocket.onclose = () => {
      console.log('WebSocket closed');
    };

    return () => {
        websocket.close();
    };
  }, [url]);

  return { departure };
};

export default useWebSocket;
