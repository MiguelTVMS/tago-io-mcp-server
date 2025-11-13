/**
 * Action and trigger type definitions for TagoIO API
 */

import { z } from 'zod';

/**
 * Action trigger types
 */
export const actionTriggerTypeSchema = z.enum([
    'condition',
    'resource',
    'interval',
    'schedule',
    'mqtt_topic',
    'usage_alert',
    'condition_geofence',
]);

export type ActionTriggerType = z.infer<typeof actionTriggerTypeSchema>;

/**
 * Action types for automated workflows
 */
export const actionTypeSchema = z.enum([
    'script',
    'notification',
    'notification_run',
    'email',
    'sms',
    'mqtt',
    'post',
    'sms-twilio',
    'whatsapp-twilio',
    'email-sendgrid',
    'email-smtp',
    'queue-sqs',
]);

export type ActionType = z.infer<typeof actionTypeSchema>;

/**
 * Resource types that can trigger actions
 */
export const resourceTypeSchema = z.enum([
    'device',
    'bucket',
    'file',
    'analysis',
    'action',
    'am',
    'user',
    'financial',
    'profile',
]);

export type ResourceType = z.infer<typeof resourceTypeSchema>;

/**
 * Resource event types
 */
export const resourceEventSchema = z.enum(['create', 'update', 'delete']);

export type ResourceEvent = z.infer<typeof resourceEventSchema>;

/**
 * Usage alert service/resource types
 */
export const usageAlertServiceSchema = z.enum([
    'input',
    'output',
    'analysis',
    'data_records',
    'sms',
    'email',
    'run_users',
    'push_notification',
    'file_storage',
    'device',
    'dashboard',
    'action',
    'tcore',
    'team_members',
    'am',
]);

export type UsageAlertService = z.infer<typeof usageAlertServiceSchema>;

/**
 * Content variable for WhatsApp templates
 */
export const contentVariableSchema = z.object({
    name: z.string().describe('The name of the variable.'),
    value: z.string().describe('The value of the variable.'),
});

export type ContentVariable = z.infer<typeof contentVariableSchema>;
