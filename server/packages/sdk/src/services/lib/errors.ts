import ExtendableError from 'es6-error';

class TcError extends ExtendableError {
  public code: number;
  public type: string;
  public data: any;
  public retryable: boolean;

  constructor(message?: string, code?: number, type?: string, data?: unknown) {
    super(message ?? 'Service Unavailable');
    this.code = code ?? this.code ?? 500;
    this.type = type ?? this.type;
    this.data = data ?? this.data;
    this.retryable = this.retryable ?? false;
  }
}

export class DataNotFoundError extends TcError {
  constructor(message?: string, code?: number, type?: string, data?: unknown) {
    super(message ?? 'Not found Data', code ?? 404, type, data);
  }
}

export class EntityError extends TcError {
  constructor(
    message?: string,
    code?: number,
    type?: string,
    data?: { field: string; message: string }[]
  ) {
    super(message ?? 'Form error', code ?? 442, type, data);
  }
}

export class NoPermissionError extends TcError {
  constructor(message?: string, code?: number, type?: string, data?: unknown) {
    super(message ?? 'No operate permission', code ?? 403, type, data);
  }
}

export class BannedError extends TcError {
  constructor(message?: string, code?: number, type?: string, data?: unknown) {
    super(message ?? 'You has been banned', code ?? 403, type, data);
  }
}

export class ServiceUnavailableError extends TcError {
  constructor(data?: unknown) {
    super('Service unavailable', 503, 'SERVICE_NOT_AVAILABLE', data);
  }
}
