/**
 * TagoIO API type definitions
 *
 * This module exports all API-related types organized by domain:
 * - Location types (GPS coordinates, geofence)
 * - Device types (configuration, metadata, device types)
 * - Data types (queries, operations, comparisons)
 * - Analysis types (runtime, execution location)
 * - Action types (triggers, workflows, resources)
 * - Profile types (metrics, statistics, secrets)
 * - Integration types (connectors, networks)
 */

// Location types
export * from './location.js';

// Device types
export * from './device.js';

// Data query and operation types
export * from './data.js';

// Analysis types
export * from './analysis.js';

// Action and trigger types
export * from './action.js';

// Profile types
export * from './profile.js';

// Integration types
export * from './integration.js';
