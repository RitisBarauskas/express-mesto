const BadRequestError = require("./bad-request");
const ConflictError = require("./conflict");
const ForbiddenError = require("./forbidden");
const NotFoundError = require("./not-found-error");
const UnauthorizedError = require("./unauthorized");
const { handleError } = require("./error-handle");

module.exports = {
  BadRequestError,
  ConflictError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
  handleError,
};
