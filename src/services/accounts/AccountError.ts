type ErrorList = {
  [code: string]: {
    code: string;
    message: string;
  };
};

const ERROR_LIST: ErrorList = {
  emailNotVerified: {
    code: 'auth/email-not-verified',
    message: 'Email is not verified',
  },
  emailAlreadyInUse: {
    code: 'auth/email-already-in-use',
    message: 'Email belongs to another account',
  },
  emailNotAllowed: {
    code: 'auth/email-not-allowed',
    message: 'Email not allowed',
  },
  wrongCredentials: {
    code: 'auth/wrong-credentials',
    message: 'Wrong email or password',
  },
  userDisabled: {
    code: 'auth/user-disabled',
    message: 'Account is disabled',
  },
  userNotFound: {
    code: 'auth/user-not-found',
    message: 'User not found',
  },
};

class AuthError extends Error {
  code: string;
  name = 'AuthError';
  constructor(code: string, messsage: string) {
    super(messsage);
    this.code = code;
  }
}

export class EmailNotVerifiedError extends AuthError {
  constructor() {
    super(
      ERROR_LIST.emailNotVerified.code,
      ERROR_LIST.emailNotVerified.message
    );
  }
}

export class EmailAlreadyInUseError extends AuthError {
  constructor() {
    super(
      ERROR_LIST.emailAlreadyInUse.code,
      ERROR_LIST.emailAlreadyInUse.message
    );
  }
}

export class WrongCredentialsError extends AuthError {
  constructor() {
    super(
      ERROR_LIST.wrongCredentials.code,
      ERROR_LIST.wrongCredentials.message
    );
  }
}

export class UserDisabledError extends AuthError {
  constructor() {
    super(ERROR_LIST.userDisabled.code, ERROR_LIST.userDisabled.message);
  }
}

export class EmailNotAllowedError extends AuthError {
  constructor() {
    super(ERROR_LIST.emailNotAllowed.code, ERROR_LIST.emailNotAllowed.message);
  }
}

export class UserNotFoundError extends AuthError {
  constructor() {
    super(ERROR_LIST.userNotFound.code, ERROR_LIST.userNotFound.message);
  }
}
