import {
  NOT_FOUND,
  EXPECTATION_FAILED,
  UNAUTHORIZED,
  FORBIDDEN,
  BAD_REQUEST,
  getStatusText,
} from 'http-status-codes';

class AppError extends Error {
  constructor(message) {
    super(message);
  }
}

class NotFoundError extends AppError {
  status: number;
  constructor(entity, params, message) {
    super(
      message || `Couldn't find a(an) ${entity} with: ${JSON.stringify(params)}`
    );
    this.status = NOT_FOUND;
  }
}

class BadRequestError extends AppError {
  status: number;
  constructor(message) {
    super(message);
    this.status = BAD_REQUEST;
  }
}

class EntityExistsError extends AppError {
  status: number;
  constructor(message) {
    super(message);
    this.status = EXPECTATION_FAILED;
  }
}

class AuthorizationError extends AppError {
  status: number;
  constructor(message) {
    super(message || getStatusText(UNAUTHORIZED));
    this.status = UNAUTHORIZED;
  }
}

class AuthenticationError extends AppError {
  status: number;
  constructor(message) {
    super(message || getStatusText(FORBIDDEN));
    this.status = FORBIDDEN;
  }
}
const NOT_FOUND_ERROR = NotFoundError;
const BAD_REQUEST_ERROR = BadRequestError;
const AUTHORIZATION_ERROR = AuthorizationError;
const AUTHENTICATION_ERROR = AuthenticationError;
const ENTITY_EXISTS = EntityExistsError;

export {
  NOT_FOUND_ERROR,
  BAD_REQUEST_ERROR,
  AUTHORIZATION_ERROR,
  AUTHENTICATION_ERROR,
  ENTITY_EXISTS,
};
