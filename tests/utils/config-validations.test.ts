import { describe, expect, it } from 'vitest';
import {
  isValidBindAddress,
  isValidHostname,
  isValidIP,
  isValidIPv4,
  isValidIPv6,
  isValidOrigin,
  stripBearerPrefix,
} from '../../src/utils/config-validations.js';

describe('stripBearerPrefix', () => {
  it('should remove Bearer prefix with space', () => {
    expect(stripBearerPrefix('Bearer token123')).toBe('token123');
  });

  it('should remove bearer prefix (case insensitive)', () => {
    expect(stripBearerPrefix('bearer token456')).toBe('token456');
    expect(stripBearerPrefix('BEARER token789')).toBe('token789');
  });

  it('should handle multiple spaces after Bearer', () => {
    expect(stripBearerPrefix('Bearer  token')).toBe('token');
  });

  it('should not modify token without Bearer prefix', () => {
    expect(stripBearerPrefix('plaintoken')).toBe('plaintoken');
  });

  it('should handle empty string', () => {
    expect(stripBearerPrefix('')).toBe('');
  });
});

describe('isValidHostname', () => {
  it('should validate simple hostname', () => {
    expect(isValidHostname('localhost')).toBe(true);
  });

  it('should validate FQDN', () => {
    expect(isValidHostname('example.com')).toBe(true);
    expect(isValidHostname('sub.example.com')).toBe(true);
    expect(isValidHostname('deep.sub.example.com')).toBe(true);
  });

  it('should validate hostname with hyphens', () => {
    expect(isValidHostname('my-server')).toBe(true);
    expect(isValidHostname('my-server.example.com')).toBe(true);
  });

  it('should reject empty string', () => {
    expect(isValidHostname('')).toBe(false);
  });

  it('should reject hostname starting with hyphen', () => {
    expect(isValidHostname('-invalid')).toBe(false);
  });

  it('should reject hostname ending with hyphen', () => {
    expect(isValidHostname('invalid-')).toBe(false);
  });

  it('should reject hostname with invalid characters', () => {
    expect(isValidHostname('invalid_hostname')).toBe(false);
    expect(isValidHostname('invalid@hostname')).toBe(false);
  });

  it('should reject hostname starting with dot', () => {
    expect(isValidHostname('.example.com')).toBe(false);
  });

  it('should reject hostname ending with dot', () => {
    expect(isValidHostname('example.com.')).toBe(false);
  });
});

describe('isValidIPv4', () => {
  it('should validate standard IPv4 addresses', () => {
    expect(isValidIPv4('192.168.1.1')).toBe(true);
    expect(isValidIPv4('10.0.0.1')).toBe(true);
    expect(isValidIPv4('172.16.0.1')).toBe(true);
  });

  it('should validate loopback address', () => {
    expect(isValidIPv4('127.0.0.1')).toBe(true);
  });

  it('should validate broadcast address', () => {
    expect(isValidIPv4('255.255.255.255')).toBe(true);
  });

  it('should validate zero address', () => {
    expect(isValidIPv4('0.0.0.0')).toBe(true);
  });

  it('should reject invalid IPv4 addresses', () => {
    expect(isValidIPv4('256.1.1.1')).toBe(false);
    expect(isValidIPv4('1.1.1')).toBe(false);
    expect(isValidIPv4('1.1.1.1.1')).toBe(false);
  });

  it('should reject empty string', () => {
    expect(isValidIPv4('')).toBe(false);
  });

  it('should reject IPv6 addresses', () => {
    expect(isValidIPv4('::1')).toBe(false);
    expect(isValidIPv4('2001:db8::1')).toBe(false);
  });
});

describe('isValidIPv6', () => {
  it('should validate loopback address', () => {
    expect(isValidIPv6('::1')).toBe(true);
  });

  it('should validate unspecified address', () => {
    expect(isValidIPv6('::')).toBe(true);
  });

  it('should validate full IPv6 addresses', () => {
    expect(isValidIPv6('2001:0db8:85a3:0000:0000:8a2e:0370:7334')).toBe(true);
    expect(isValidIPv6('2001:db8:85a3:0:0:8a2e:370:7334')).toBe(true);
  });

  it('should validate compressed IPv6 addresses', () => {
    expect(isValidIPv6('2001:db8::1')).toBe(true);
    expect(isValidIPv6('::ffff:192.0.2.1')).toBe(false); // IPv4-mapped not supported by this regex
    expect(isValidIPv6('fe80::1')).toBe(true);
  });

  it('should validate link-local addresses', () => {
    expect(isValidIPv6('fe80::1')).toBe(true);
  });

  it('should reject invalid IPv6 addresses', () => {
    expect(isValidIPv6('gggg::1')).toBe(false);
    expect(isValidIPv6('2001:db8::1::2')).toBe(false); // Double compression
  });

  it('should reject empty string', () => {
    expect(isValidIPv6('')).toBe(false);
  });

  it('should reject IPv4 addresses', () => {
    expect(isValidIPv6('192.168.1.1')).toBe(false);
  });
});

describe('isValidIP', () => {
  it('should validate IPv4 addresses', () => {
    expect(isValidIP('192.168.1.1')).toBe(true);
    expect(isValidIP('127.0.0.1')).toBe(true);
  });

  it('should validate IPv6 addresses', () => {
    expect(isValidIP('::1')).toBe(true);
    expect(isValidIP('2001:db8::1')).toBe(true);
  });

  it('should reject invalid IP addresses', () => {
    expect(isValidIP('not-an-ip')).toBe(false);
    expect(isValidIP('256.1.1.1')).toBe(false);
  });

  it('should reject empty string', () => {
    expect(isValidIP('')).toBe(false);
  });
});

describe('isValidOrigin', () => {
  it('should validate hostnames', () => {
    expect(isValidOrigin('localhost')).toBe(true);
    expect(isValidOrigin('example.com')).toBe(true);
  });

  it('should validate IPv4 addresses', () => {
    expect(isValidOrigin('127.0.0.1')).toBe(true);
    expect(isValidOrigin('192.168.1.1')).toBe(true);
  });

  it('should validate IPv6 addresses', () => {
    expect(isValidOrigin('::1')).toBe(true);
    expect(isValidOrigin('2001:db8::1')).toBe(true);
  });

  it('should reject invalid origins', () => {
    expect(isValidOrigin('')).toBe(false);
    expect(isValidOrigin('invalid_hostname')).toBe(false);
    expect(isValidOrigin('invalid@hostname')).toBe(false);
  });
});

describe('isValidBindAddress', () => {
  it('should validate IPv4 bind addresses', () => {
    expect(isValidBindAddress('127.0.0.1')).toBe(true);
    expect(isValidBindAddress('0.0.0.0')).toBe(true);
    expect(isValidBindAddress('192.168.1.1')).toBe(true);
  });

  it('should validate IPv6 bind addresses', () => {
    expect(isValidBindAddress('::1')).toBe(true);
    expect(isValidBindAddress('::')).toBe(true);
    expect(isValidBindAddress('fe80::1')).toBe(true);
  });

  it('should reject hostnames', () => {
    expect(isValidBindAddress('localhost')).toBe(false);
    expect(isValidBindAddress('example.com')).toBe(false);
  });

  it('should reject invalid addresses', () => {
    expect(isValidBindAddress('256.1.1.1')).toBe(false);
    expect(isValidBindAddress('not-an-ip')).toBe(false);
  });

  it('should reject empty string', () => {
    expect(isValidBindAddress('')).toBe(false);
  });
});
