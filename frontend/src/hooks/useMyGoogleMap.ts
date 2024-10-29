import { useState, useCallback } from 'react';

interface UseGoogleMapProps {
  startStation: string;
  endStation: string;
}

export const useMyGoogleMap = () => {
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const fetchDirections = useCallback((startStation: string, endStation: string) => {
    const directionsService = new google.maps.DirectionsService();
    setDirections(null);

    directionsService.route(
      {
        origin: startStation,
        destination: endStation,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          setDirections(result);
        } else {
          console.error(`Error fetching directions ${result}`);
        }
      }
    );
    setReloadKey((prev) => prev + 1);
  }, []);

  return {
    directions,
    reloadKey,
    fetchDirections,
  };
};