/*
 * moleculer
 * Copyright (c) 2021 MoleculerJS (https://github.com/moleculerjs/moleculer)
 * MIT Licensed
 */

import { Errors } from 'moleculer';

const { MoleculerError, MoleculerClientError } = Errors;

export { MoleculerError, MoleculerClientError };

const ERR_NO_TOKEN = 'NO_TOKEN';
const ERR_INVALID_TOKEN = 'INVALID_TOKEN';
const ERR_UNABLE_DECODE_PARAM = 'UNABLE_DECODE_PARAM';
const ERR_ORIGIN_NOT_FOUND = 'ORIGIN_NOT_FOUND';
const ERR_ORIGIN_NOT_ALLOWED = 'ORIGIN_NOT_ALLOWED';

/**
 * Invalid request body
 *
 * @class InvalidRequestBodyError
 * @extends {Error}
 */
class InvalidRequestBodyError extends MoleculerError {
  /**
   * Creates an instance of InvalidRequestBodyError.
   *
   * @param {any} body
   * @param {any} error
   *
   * @memberOf InvalidRequestBodyError
   */
  constructor(body, error) {
    super('Invalid request body', 400, 'INVALID_REQUEST_BODY', {
      body,
      error,
    });
  }
}

/**
 * Invalid response type
 *
 * @class InvalidResponseTypeError
 * @extends {Error}
 */
class InvalidResponseTypeError extends MoleculerError {
  /**
   * Creates an instance of InvalidResponseTypeError.
   *
   * @param {String} dataType
   *
   * @memberOf InvalidResponseTypeError
   */
  constructor(dataType) {
    super(`Invalid response type '${dataType}'`, 500, 'INVALID_RESPONSE_TYPE', {
      dataType,
    });
  }
}

/**
 * Unauthorized HTTP error
 *
 * @class UnAuthorizedError
 * @extends {Error}
 */
class UnAuthorizedError extends MoleculerError {
  /**
   * Creates an instance of UnAuthorizedError.
   *
   * @param {String} type
   * @param {any} data
   *
   * @memberOf UnAuthorizedError
   */
  constructor(type, data) {
    super('Unauthorized', 401, type || ERR_INVALID_TOKEN, data);
  }
}

/**
 * Forbidden HTTP error
 *
 * @class ForbiddenError
 * @extends {Error}
 */
class ForbiddenError extends MoleculerError {
  /**
   * Creates an instance of ForbiddenError.
   *
   * @param {String} type
   * @param {any} data
   *
   * @memberOf ForbiddenError
   */
  constructor(type, data?) {
    super('Forbidden', 403, type, data);
  }
}

/**
 * Bad request HTTP error
 *
 * @class BadRequestError
 * @extends {Error}
 */
class BadRequestError extends MoleculerError {
  /**
   * Creates an instance of BadRequestError.
   *
   * @param {String} type
   * @param {any} data
   *
   * @memberOf BadRequestError
   */
  constructor(type, data) {
    super('Bad request', 400, type, data);
  }
}

/**
 * Not found HTTP error
 *
 * @class NotFoundError
 * @extends {Error}
 */
class NotFoundError extends MoleculerError {
  /**
   * Creates an instance of NotFoundError.
   *
   * @param {String} type
   * @param {any} data
   *
   * @memberOf NotFoundError
   */
  constructor(type?, data?) {
    super('Not found', 404, type || 'NOT_FOUND', data);
  }
}

/**
 * Payload is too large HTTP error
 *
 * @class PayloadTooLarge
 * @extends {Error}
 */
class PayloadTooLarge extends MoleculerClientError {
  /**
   * Creates an instance of PayloadTooLarge.
   *
   * @param {String} type
   * @param {any} data
   *
   * @memberOf PayloadTooLarge
   */
  constructor(data) {
    super('Payload too large', 413, 'PAYLOAD_TOO_LARGE', data);
  }
}

/**
 * Rate limit exceeded HTTP error
 *
 * @class RateLimitExceeded
 * @extends {Error}
 */
class RateLimitExceeded extends MoleculerClientError {
  /**
   * Creates an instance of RateLimitExceeded.
   *
   * @param {String} type
   * @param {any} data
   *
   * @memberOf RateLimitExceeded
   */
  constructor(type?, data?) {
    super('Rate limit exceeded', 429, type, data);
  }
}

/**
 * Service unavailable HTTP error
 *
 * @class ForbiddenError
 * @extends {Error}
 */
class ServiceUnavailableError extends MoleculerError {
  /**
   * Creates an instance of ForbiddenError.
   *
   * @param {String} type
   * @param {any} data
   *
   * @memberOf ForbiddenError
   */
  constructor(type?, data?) {
    super('Service unavailable', 503, type, data);
  }
}

export {
  InvalidRequestBodyError,
  InvalidResponseTypeError,
  UnAuthorizedError,
  ForbiddenError,
  BadRequestError,
  NotFoundError,
  PayloadTooLarge,
  RateLimitExceeded,
  ServiceUnavailableError,
  ERR_NO_TOKEN,
  ERR_INVALID_TOKEN,
  ERR_UNABLE_DECODE_PARAM,
  ERR_ORIGIN_NOT_FOUND,
  ERR_ORIGIN_NOT_ALLOWED,
};
