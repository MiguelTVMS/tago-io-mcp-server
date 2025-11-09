/**
 * Configuration validation utilities for HTTP server settings.
 * These validators ensure security and correctness of network-related configurations.
 */

/**
 * Removes the 'Bearer ' prefix from an authorization token if present
 * @param token - The authorization token
 * @returns The token without the Bearer prefix
 */
export function stripBearerPrefix(token: string): string {
  return token.replace(/^Bearer\s+/i, '');
}

/**
 * Validates if a string is a valid hostname
 * @param hostname - The hostname to validate
 * @returns true if valid hostname, false otherwise
 */
export function isValidHostname(hostname: string): boolean {
  if (!hostname || hostname.length === 0) {
    return false;
  }
  // Simple hostname validation (alphanumeric, hyphens, dots)
  // Each label must start and end with alphanumeric, can contain hyphens
  const hostnameRegex =
    /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)*[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/i;
  return hostnameRegex.test(hostname);
}

/**
 * Validates if a string is a valid IPv4 address
 * @param ip - The IP address to validate
 * @returns true if valid IPv4 address, false otherwise
 */
export function isValidIPv4(ip: string): boolean {
  if (!ip || ip.length === 0) {
    return false;
  }
  const ipv4Regex =
    /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  return ipv4Regex.test(ip);
}

/**
 * Validates if a string is a valid IPv6 address
 * @param ip - The IP address to validate
 * @returns true if valid IPv6 address, false otherwise
 */
export function isValidIPv6(ip: string): boolean {
  if (!ip || ip.length === 0) {
    return false;
  }
  // Handle special cases
  if (ip === '::' || ip === '::1') {
    return true;
  }
  // Comprehensive IPv6 validation patterns
  const ipv6Patterns = [
    // Full form: 8 groups of 4 hex digits
    /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/,
    // Compressed form with :: at the beginning
    /^::(?:[0-9a-fA-F]{1,4}:){0,6}[0-9a-fA-F]{1,4}$/,
    // Compressed form with :: at the end
    /^(?:[0-9a-fA-F]{1,4}:){1,7}:$/,
    // Compressed form with :: in the middle
    /^(?:[0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}$/,
    /^(?:[0-9a-fA-F]{1,4}:){1,5}(?::[0-9a-fA-F]{1,4}){1,2}$/,
    /^(?:[0-9a-fA-F]{1,4}:){1,4}(?::[0-9a-fA-F]{1,4}){1,3}$/,
    /^(?:[0-9a-fA-F]{1,4}:){1,3}(?::[0-9a-fA-F]{1,4}){1,4}$/,
    /^(?:[0-9a-fA-F]{1,4}:){1,2}(?::[0-9a-fA-F]{1,4}){1,5}$/,
    /^[0-9a-fA-F]{1,4}:(?::[0-9a-fA-F]{1,4}){1,6}$/,
  ];

  return ipv6Patterns.some((pattern) => pattern.test(ip));
}

/**
 * Validates if a string is a valid IP address (IPv4 or IPv6)
 * @param ip - The IP address to validate
 * @returns true if valid IP address, false otherwise
 */
export function isValidIP(ip: string): boolean {
  return isValidIPv4(ip) || isValidIPv6(ip);
}

/**
 * Validates if a string is a valid origin (hostname, IP, or wildcard)
 * @param origin - The origin to validate
 * @returns true if valid origin, false otherwise
 */
export function isValidOrigin(origin: string): boolean {
  // Allow wildcard '*' for any origin (NOT recommended for production)
  if (origin === '*') {
    return true;
  }
  return isValidHostname(origin) || isValidIP(origin);
}

/**
 * Validates a bind address (must be a valid IP address)
 * @param addr - The bind address to validate
 * @returns true if valid bind address, false otherwise
 */
export function isValidBindAddress(addr: string): boolean {
  if (!addr || addr.length === 0) {
    return false;
  }
  return isValidIP(addr);
}
