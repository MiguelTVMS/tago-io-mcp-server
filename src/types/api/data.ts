/**
 * Data query and operation type definitions for TagoIO API
 */

import { z } from 'zod';

/**
 * Data query types for device data retrieval operations
 * Defines the various query modes available for fetching device data
 */
export const dataQueryTypeSchema = z.enum([
  'default',
  'last_item',
  'last_value',
  'last_location',
  'last_insert',
  'first_item',
  'first_value',
  'first_location',
  'first_insert',
  'min',
  'max',
  'count',
  'avg',
  'sum',
  'aggregate',
  'conditional',
]);

export type DataQueryType = z.infer<typeof dataQueryTypeSchema>;

/**
 * Time intervals for data aggregation
 * Used in aggregate queries to group data by time periods
 */
export const timeIntervalSchema = z.enum(['minute', 'hour', 'day', 'month', 'quarter', 'year']);

export type TimeInterval = z.infer<typeof timeIntervalSchema>;

/**
 * Comparison functions for conditional and aggregate queries
 */
export const comparisonFunctionSchema = z.enum([
  'avg',
  'sum',
  'min',
  'max',
  'gt',
  'gte',
  'lt',
  'lte',
  'eq',
  'ne',
]);

export type ComparisonFunction = z.infer<typeof comparisonFunctionSchema>;

/**
 * Data ordination options
 */
export const ordinationSchema = z.enum(['descending', 'ascending']);

export type Ordination = z.infer<typeof ordinationSchema>;

/**
 * Condition comparison operators
 */
export const conditionOperatorSchema = z.enum(['=', '>', '<', '>=', '<=', '<>']);

export type ConditionOperator = z.infer<typeof conditionOperatorSchema>;

/**
 * Value types for condition comparisons
 */
export const valueTypeSchema = z.enum(['string', 'number', 'boolean', '*']);

export type ValueType = z.infer<typeof valueTypeSchema>;
