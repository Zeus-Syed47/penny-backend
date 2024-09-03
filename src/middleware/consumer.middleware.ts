import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { UserService } from 'src/user/user.service';
import { verifyClaim } from 'src/utils/token';
import { isEmpty } from 'src/utils/varCheck';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly user: UserService) {}
  async use(req: any, res: Response, next: NextFunction) {
    if (req.headers.authorization) {
      const authBearer = req.headers.authorization;
      const authBearerArray = authBearer.split(' ');

      if (authBearerArray?.length < 2) {
        res.writeHead(401, { 'content-type': 'application/json' });
        res.write('Auth Token is missing');
        res.send();
        return;
      }
      const auth = await this.user.findAuthByToken(authBearerArray[1]);

      if (isEmpty(auth)) {
        res.writeHead(401, { 'content-type': 'application/json' });
        res.write('Invalid or expired Auth Token');
        res.send();
        return;
      } else {
        const decoded = await verifyClaim(auth.auth_token);
        if (isEmpty(decoded)) {
          res.writeHead(401, { 'content-type': 'application/json' });
          res.write('Invalid or expired Auth Token');
          res.send();
          return;
        } else {
          req.user = {
            user_id: decoded.data,
          };
        }
      }
    } else {
      res.writeHead(401, { 'content-type': 'application/json' });
      res.write('Auth Token is missing');
      res.send();
      return;
    }

    next();
  }
}
