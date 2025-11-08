/**
 * Formats a job location for display
 * @param {string|object} location - Location data (string or object with city/state/region)
 * @returns {string} Formatted location string
 */
export function formatLocation(location) {
  if (!location) return 'Location not specified';
  
  // If it's already a string, return it
  if (typeof location === 'string') return location;
  
  // If it's an object, format it
  if (typeof location === 'object') {
    const { city, state, region, remote, hybrid } = location;
    
    // Handle remote/hybrid flags
    if (remote && hybrid && city && state) {
      return `${city}, ${state} (Hybrid/Remote)`;
    }
    if (remote) {
      return 'Remote';
    }
    if (hybrid && city && state) {
      return `${city}, ${state} (Hybrid)`;
    }
    
    // Build location string from available parts
    const parts = [];
    if (city) parts.push(city);
    if (state) parts.push(state);
    else if (region) parts.push(region);
    
    return parts.length > 0 ? parts.join(', ') : 'Location not specified';
  }
  
  return 'Location not specified';
}
