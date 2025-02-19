import { useState, useEffect } from "react";
import { UseFormSetValue } from "react-hook-form";
import { PhotoFormData } from "../types";

interface UseLocationProps {
  form: {
    setValue: UseFormSetValue<PhotoFormData>;
  };
  exif: {
    latitude?: number;
    longitude?: number;
  } | null;
}

export function useLocation({ form, exif }: UseLocationProps) {
  const [currentLocation, setCurrentLocation] = useState<{
    lat: number;
    lng: number;
  }>({
    lat: 39.9042, // Default to Beijing
    lng: 116.4074,
  });

  useEffect(() => {
    if ("geolocation" in navigator && !exif?.latitude && !exif?.longitude) {
      const timeoutId = setTimeout(() => {
        try {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const newLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              };
              setCurrentLocation(newLocation);

              form.setValue("latitude", newLocation.lat);
              form.setValue("longitude", newLocation.lng);
            },
            (error) => {
              console.warn("Unable to get location:", error.message);
            },
            {
              timeout: 5000,
              maximumAge: 0,
              enableHighAccuracy: false,
            }
          );
        } catch (error) {
          console.warn("Geolocation error:", error);
        }
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  }, [exif, form]);

  return {
    currentLocation,
    setCurrentLocation,
  };
}
