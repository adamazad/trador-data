import AuthBearer from 'hapi-auth-bearer-token';
import { Server, UserCredentials } from '@hapi/hapi';
import { AppUser } from '@interfaces/AppUser';
import { IRequestAuth } from '@interfaces/Request';
import JwtService from '@services/jwt';

interface JwtValidationResult {
  isValid: Boolean;
  credentials: UserCredentials | null;
  artifacts: Object;
}

const register = async (server: Server) => {
  await server.register(AuthBearer);

  server.auth.strategy('bearer', 'bearer-access-token', {
    allowQueryToken: true,
    validate: async (_req, token) => {
      let claim: AppUser;
      let auth: JwtValidationResult = {
        artifacts: {},
        isValid: false,
        credentials: null,
      };

      try {
        claim = await JwtService.verify<AppUser>(token, {
          ignoreExpiration: false,
        });

        auth = {
          credentials: claim,
          artifacts: {},
          isValid: true,
        };
      } catch (claimError) {
        console.log(claimError);
      }

      return auth;
    },
  });

  server.auth.default('bearer');
};

export default {
  name: 'Auth',
  version: '0.0.1',
  register,
};
