import { createHmac } from 'crypto';

/**
 * Create signature key for service
 * @param method
 * @param path
 * @param timestamp
 * @param body
 * @param secret
 * @returns
 */
export const generateSignatureService = (
  method: string,
  path: string,
  timestamp: string,
  body: unknown,
  secret: string,
): string => {
  const payload = [
    method.toUpperCase(),
    path,
    timestamp,
    JSON.stringify(body),
  ].join('\n');

  return createHmac('sha256', secret).update(payload).digest('hex');
};
