/**
 * Helper function to detect city name based on coordinates
 * Fixes Geoapify confusion between Butwal, Tilottama, and Sannoulit
 * Also normalizes city names (e.g., "Kathmandu Metropolitan City" -> "Kathmandu")
 * 
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @param {string} geoapifyCity - City name returned by Geoapify API
 * @returns {string} - Corrected city name
 */

// Coordinate ranges for Butwal and Tilottama
// Butwal: approximately 27.7°N, 83.45°E
// Tilottama: approximately 27.65°N, 83.45°E
const BUTWAL_BOUNDS = {
  minLat: 27.68,
  maxLat: 27.75,
  minLon: 83.35,
  maxLon: 83.55
};

const TILOTTAMA_BOUNDS = {
  minLat: 27.60,
  maxLat: 27.68,
  minLon: 83.35,
  maxLon: 83.55
};

export const getCorrectCityName = (lat, lon, geoapifyCity) => {
  // First check if coordinates are in the general area (Butwal/Tilottama region)
  if (
    lat >= 27.60 &&
    lat <= 27.75 &&
    lon >= 83.35 &&
    lon <= 83.55
  ) {
    // Determine city based on latitude
    // Tilottama is south of Butwal
    if (lat >= TILOTTAMA_BOUNDS.minLat && lat < TILOTTAMA_BOUNDS.maxLat) {
      return "Tilottama";
    }
    // Butwal is north of Tilottama
    if (lat >= BUTWAL_BOUNDS.minLat && lat <= BUTWAL_BOUNDS.maxLat) {
      return "Butwal";
    }
  }

  // If coordinates don't match known ranges, check for common Geoapify mistakes
  if (geoapifyCity) {
    const cityLower = geoapifyCity.toLowerCase();
    // Fix Sannoulit confusion - if Geoapify says Sannoulit but we're in Tilottama/Butwal area
    if (cityLower.includes("sannoulit") || cityLower.includes("sannoulit")) {
      // Check if we're in the general area
      if (
        lat >= 27.60 &&
        lat <= 27.75 &&
        lon >= 83.35 &&
        lon <= 83.55
      ) {
        // Determine based on latitude
        if (lat < 27.68) {
          return "Tilottama";
        } else {
          return "Butwal";
        }
      }
    }
    
    // Also check if Geoapify returned Butwal or Tilottama but coordinates suggest otherwise
    if (cityLower.includes("butwal")) {
      // If coordinates suggest Tilottama, override
      if (lat >= 27.60 && lat < 27.68 && lon >= 83.35 && lon <= 83.55) {
        return "Tilottama";
      }
    }
    
    if (cityLower.includes("tilottama")) {
      // If coordinates suggest Butwal, override
      if (lat >= 27.68 && lat <= 27.75 && lon >= 83.35 && lon <= 83.55) {
        return "Butwal";
      }
    }
  }

  // Normalize common city name variations before returning
  if (geoapifyCity) {
    const cityLower = geoapifyCity.toLowerCase();
    
    // Normalize Kathmandu variations
    if (cityLower.includes("kathmandu")) {
      // Remove "metropolitan city", "metropolitan", "municipality" etc.
      if (cityLower.includes("metropolitan") || cityLower.includes("municipality")) {
        return "Kathmandu";
      }
      // If it's just "kathmandu" or similar, return "Kathmandu"
      return "Kathmandu";
    }
    
    // Normalize other common city name patterns
    // Remove "Metropolitan City", "Municipality", "Metropolitan" suffixes
    let normalizedCity = geoapifyCity;
    
    // Common suffixes to remove
    const suffixesToRemove = [
      " Metropolitan City",
      " Metropolitan",
      " Municipality",
      " Metropolis"
    ];
    
    for (const suffix of suffixesToRemove) {
      if (normalizedCity.endsWith(suffix)) {
        normalizedCity = normalizedCity.replace(suffix, "");
        break;
      }
    }
    
    return normalizedCity;
  }

  // Return empty string if no city name provided
  return "";
};

