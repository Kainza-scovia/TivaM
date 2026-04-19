// Routing service for calculating distances and travel times
// Uses OpenRouteService API (free tier)

export interface RouteInfo {
  distance: number; // in meters
  duration: number; // in seconds
  distanceText: string; // formatted distance
  durationText: string; // formatted duration
}

/**
 * Calculate distance and travel time between two coordinates
 * Uses OpenRouteService API for accurate routing
 */
export async function getRouteInfo(
  startLat: number,
  startLng: number,
  endLat: number,
  endLng: number,
  profile: 'driving-car' | 'foot-walking' | 'cycling-regular' = 'driving-car'
): Promise<RouteInfo | null> {
  try {
    // Using OSRM (Open Source Routing Machine) which is free and doesn't require API key
    const response = await fetch(
      `https://router.project-osrm.org/route/v1/${profile}/${startLng},${startLat};${endLng},${endLat}?overview=false`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch route information');
    }

    const data = await response.json();

    if (!data.routes || data.routes.length === 0) {
      return null;
    }

    const route = data.routes[0];
    const distance = route.distance; // meters
    const duration = route.duration; // seconds

    return {
      distance,
      duration,
      distanceText: formatDistance(distance),
      durationText: formatDuration(duration),
    };
  } catch (error) {
    console.error('[v0] Error fetching route info:', error);
    // Return approximate distance using haversine formula as fallback
    return getApproximateDistance(startLat, startLng, endLat, endLng);
  }
}

/**
 * Calculate approximate distance using Haversine formula
 * Used as fallback when routing API is unavailable
 */
function getApproximateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): RouteInfo {
  const R = 6371000; // Earth's radius in meters
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  // Estimate duration assuming 40 km/h average
  const avgSpeed = 40 / 3.6; // km/h to m/s
  const duration = distance / avgSpeed;

  return {
    distance,
    duration,
    distanceText: formatDistance(distance),
    durationText: formatDuration(duration),
  };
}

function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Format distance in meters to human-readable string
 */
function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }
  return `${(meters / 1000).toFixed(1)} km`;
}

/**
 * Format duration in seconds to human-readable string
 */
function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  if (minutes > 0) {
    return `${minutes} min`;
  }
  return `${Math.round(seconds)} sec`;
}
