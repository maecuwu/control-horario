// Login interface
export class Login {
  userName: string;
  password: string;
}

// Token interface
export class Token {
  token: string;
  expiration: string;
}

// Payload interface
export class Payload {
  sub: string;
  jti: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  'family_name': string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  'given_name': string;
  email: string;
  aud: string;
  exp: number;
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': string;
  iss: string;
}

// Forgot Password interface
export class ForgotPassword {
  email: string;
}

// Reset Password interface
export class ResetPassword {
  email: string;
  code: string;
  newPassword: string;
}
