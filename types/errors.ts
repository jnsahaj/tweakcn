export class UnauthorizedError extends Error {
  constructor(message = "Unauthorized") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export class ValidationError extends Error {
  constructor(
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = "ValidationError";
  }
}

export class ThemeNotFoundError extends Error {
  constructor(message = "Theme not found") {
    super(message);
    this.name = "ThemeNotFoundError";
  }
}

export class ThemeLimitError extends Error {
  constructor(message = "Theme limit reached") {
    super(message);
    this.name = "ThemeLimitError";
  }
}
