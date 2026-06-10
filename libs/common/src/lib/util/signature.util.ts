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

const path = '/payments';
const timestamp = Date.now().toString();

const signature = generateSignatureService(
  'POST',
  path,
  timestamp,
  {
    orderId: 'd-123',
    amount: 10000,
  },
  '5cfbf8b8c3d641f59d75d9f5f7c12f51',
);

console.log({ signature, timestamp });
