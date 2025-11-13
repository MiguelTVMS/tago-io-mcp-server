/**
 * Location-related type definitions for TagoIO API
 */

import { z } from 'zod';

/**
 * Location latitude/longitude coordinates
 * Used in device data operations for geolocation data
 */
export const locationLatLngSchema = z
    .object({
        lat: z.number().describe('Latitude value.'),
        lng: z.number().describe('Longitude value.'),
    })
    .describe('Object with latitude and longitude properties.');

export type LocationLatLng = z.infer<typeof locationLatLngSchema>;

/**
 * Geofence value definition for location-based triggers
 */
export const geofenceValueSchema = z
    .object({
        center: z.array(z.number()).optional().describe('Center coordinates [longitude, latitude]'),
        radius: z.number().optional().describe('Radius in kilometers'),
        coordinates: z
            .array(z.array(z.number()))
            .optional()
            .describe('Polygon coordinates [[lon,lat], ...]'),
    })
    .describe('The geofence definition');

export type GeofenceValue = z.infer<typeof geofenceValueSchema>;

/**
 * Geofence entry/exit conditions
 */
export const geofenceConditionSchema = z.enum(['IN', 'OUT']);

export type GeofenceCondition = z.infer<typeof geofenceConditionSchema>;
