import { sign as signBase, verify as verifyBase, VerifyOptions, Secret, SignOptions } from 'jsonwebtoken';
import { JWT_SECRET, JWT_EXPIRES_IN, JWT_AUD } from '@constants';

let secret: Secret = JWT_SECRET as string;
let expires_in: number = JWT_EXPIRES_IN;

/**
 * Sets the current JWT secret used
 * @param {String} secret
 */
export function setSecret(secretOrPublicKey: Secret): void {
  secret = secretOrPublicKey;
}

/**
 * Returns the current JWT secret used
 */
export function getSecret(): Secret {
  return secret;
}

/**
 * Sets `expiresIn` option for sign methods
 * @param {number} expiresIn
 */
export function setExpiresIn(expiresIn: number): void {
  expires_in = expiresIn;
}

/**
 * Return the current JWT secret used
 */
export function getExpiresIn(): number {
  return expires_in;
}

/**
 * Verifies the JWT token, return the claim
 * @param {String} token
 * @param {VerifyOptions} verifyOptions
 * @returns {Promise<Object>} An Object with the claim
 */
export async function verify<R>(token: string, verifyOptions: VerifyOptions | undefined = undefined): Promise<R> {
  return new Promise((resolve, reject) => {
    return verifyBase(token, getSecret(), verifyOptions, (err, decoded: any) => {
      if (err) {
        return reject(err);
      }

      return resolve(decoded as R);
    });
  });
}

/**
 *
 * @param {any} payload the payload
 * @param {SignOptions} options signing option
 */
export async function sign(payload: any, signOptions: SignOptions = { expiresIn: JWT_EXPIRES_IN }) {
  return signBase({ ...payload, aud: JWT_AUD }, getSecret(), {
    ...signOptions,
  });
}

interface JwtService {
  verify<R>(token: string, verifyOptions?: VerifyOptions | undefined): Promise<R>;
  sign(payload: any, signOptions?: SignOptions): Promise<string>;
  setSecret(secretOrPublicKey: Secret): void;
  getSecret(): Secret;
  setExpiresIn(expiresIn: number): void;
  getExpiresIn(): number;
}

const JwtService: JwtService = {
  verify,
  sign,
  setSecret,
  getSecret,
  setExpiresIn,
  getExpiresIn,
};

export default JwtService;
