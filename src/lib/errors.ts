export class UnauthorizedError extends Error {
  statusCode: number;
  constructor(message = "Unauthorized") {
    super(message);
    this.name = "UnauthorizedError";
    this.statusCode = 401;
  }
}
