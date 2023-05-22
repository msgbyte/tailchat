/**
 * @file statusMessages
 * @description handles status messages / error responses
 */

import type { Response } from 'express';

/**
 * Handles rejections other than errors. 400, 401, etc.
 */
function reject(res: Response, status: number, reason?: any) {
  return res.status(status).json({ message: reason ?? 'Invalid request' });
}

/**
 * Handles errors
 */
function error(res: Response, status: number, e: Error, message?: string) {
  if (process.env.NODE_ENV !== 'production') {
    return res.status(status).json({ message, error: e.message });
  }
}

export default { reject, error };
