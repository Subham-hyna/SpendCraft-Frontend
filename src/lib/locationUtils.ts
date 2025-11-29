import axios from "axios";

/**
 * Geolocation error codes
 */
export enum GeolocationErrorCode {
  PERMISSION_DENIED = 1,
  POSITION_UNAVAILABLE = 2,
  TIMEOUT = 3,
}

/**
 * Options for geolocation detection
 */
export interface LocationDetectionOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
}

/**
 * Default options for geolocation
 */
const DEFAULT_OPTIONS: LocationDetectionOptions = {
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 0,
};

/**
 * Checks if geolocation is supported by the browser
 */
export const isGeolocationSupported = (): boolean => {
  return typeof navigator !== "undefined" && "geolocation" in navigator;
};

/**
 * Gets the user's current position using the browser's Geolocation API
 */
export const getCurrentPosition = (
  options: LocationDetectionOptions = {}
): Promise<GeolocationPosition> => {
  if (!isGeolocationSupported()) {
    throw new Error("Geolocation is not supported by your browser");
  }

  const mergedOptions = { ...DEFAULT_OPTIONS, ...options };

  return new Promise<GeolocationPosition>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      resolve,
      reject,
      mergedOptions
    );
  });
};

/**
 * Interface for Nominatim API response
 */
interface NominatimAddress {
  city?: string;
  town?: string;
  village?: string;
  state?: string;
  country?: string;
  [key: string]: any;
}

interface NominatimResponse {
  address?: NominatimAddress;
  display_name?: string;
}

/**
 * Reverse geocodes coordinates to a readable address using OpenStreetMap Nominatim API
 */
export const reverseGeocode = async (
  latitude: number,
  longitude: number
): Promise<string> => {
  try {
    const response = await axios.get<NominatimResponse>(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`,
      {
        headers: {
          "User-Agent": "SpendCraft-App", // Required by Nominatim
        },
      }
    );

    if (response.status !== 200) {
      throw new Error("Failed to fetch location data");
    }

    const data = response.data;
    const address = data.address || {};

    // Format location: city, state, country or similar readable format
    let formattedLocation = "";

    // Try to build a readable location string
    if (address.city) {
      formattedLocation = address.city;
      if (address.state) {
        formattedLocation += `, ${address.state}`;
      }
      if (address.country) {
        formattedLocation += `, ${address.country}`;
      }
    } else if (address.town) {
      formattedLocation = address.town;
      if (address.state) {
        formattedLocation += `, ${address.state}`;
      }
      if (address.country) {
        formattedLocation += `, ${address.country}`;
      }
    } else if (address.village) {
      formattedLocation = address.village;
      if (address.state) {
        formattedLocation += `, ${address.state}`;
      }
      if (address.country) {
        formattedLocation += `, ${address.country}`;
      }
    } else if (address.state && address.country) {
      formattedLocation = `${address.state}, ${address.country}`;
    } else if (address.country) {
      formattedLocation = address.country;
    } else {
      // Fallback to display name if available
      formattedLocation =
        data.display_name?.split(",")[0] || "Location detected";
    }

    return formattedLocation;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error("Failed to fetch location data from geocoding service");
    }
    throw error;
  }
};

/**
 * Detects the user's location and returns a formatted address string
 * @param options - Optional geolocation options
 * @returns A formatted location string (e.g., "Mumbai, Maharashtra, India")
 * @throws Error with appropriate message if location detection fails
 */
export const detectUserLocation = async (
  options: LocationDetectionOptions = {}
): Promise<string> => {
  if (!isGeolocationSupported()) {
    throw new Error("Geolocation is not supported by your browser");
  }

  // Get user's coordinates
  const position = await getCurrentPosition(options);
  const { latitude, longitude } = position.coords;

  // Reverse geocode to get readable address
  const formattedLocation = await reverseGeocode(latitude, longitude);

  return formattedLocation;
};

/**
 * Gets a user-friendly error message for geolocation errors
 */
export const getGeolocationErrorMessage = (error: GeolocationPositionError): string => {
  switch (error.code) {
    case GeolocationErrorCode.PERMISSION_DENIED:
      return "Location access denied. Please enable location permissions.";
    case GeolocationErrorCode.POSITION_UNAVAILABLE:
      return "Location information unavailable";
    case GeolocationErrorCode.TIMEOUT:
      return "Location request timed out. Please try again.";
    default:
      return "Failed to detect location. Please enter manually.";
  }
};

