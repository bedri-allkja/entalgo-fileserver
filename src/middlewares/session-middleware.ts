import { Request, Response, NextFunction } from 'express';
import * as express from 'express';
import * as moment from 'moment';
import { Config } from '../config';
import { SessionManager, SessionPayload } from '../lib/session-manager';
import { Sequelize } from 'sequelize';
import { HttpResponseStatus } from '../environment';
import { Logger } from '../lib/logger';

export interface SessionRequest extends Request {
  session?: SessionPayload;
  token: string;
}

export class SessionMiddleware {
  public sessionManager: SessionManager;
  constructor(private connection: Sequelize, private config: Config, private logger: Logger) {
    this.sessionManager = new SessionManager(this.config);
  }

  checkAuthentication(): express.RequestHandler {
    return (request: SessionRequest, response: Response, next: NextFunction) => {
      let token: string = request.headers['authorization'];
      if (token) {
        let sessionData: SessionPayload = null;
        return this.sessionManager.get(token)
          .then((data: SessionPayload) => {
            sessionData = data;
            return this.sessionManager.checkRefresh(token);
          })
          .then((newSession) => {
            if (newSession) {
              sessionData = newSession;
              return this.sessionManager.refreshToken(token, newSession);
            } else {
              return Promise.resolve(token);
            }
          })
          .then((validToken) => {
            if (validToken !== token) {
              let options: express.CookieOptions = null;
              if (sessionData.persistent) options = { expires: moment().add(1, 'y').toDate() };
              response.cookie(this.config.sessionCookieName, validToken, options);
            }
            request.session = sessionData;
            request.token = validToken;
            next();
          })
          .catch((error) => {
            next(error);
          });
      } else {
        response.sendStatus(HttpResponseStatus.NOT_AUTHENTICATED);
      }
    };
  }

  checkPermission(permission: string): express.RequestHandler {
    return (request: SessionRequest, response: Response, next: NextFunction) => {
      let token: string = request.cookies[this.config.sessionCookieName];
      if (token) {
        let sessionData: SessionPayload = null;
        return this.sessionManager.get(token)
          .then((data: SessionPayload) => {
            sessionData = data;
            return this.sessionManager.checkRefresh(token);
          })
          .then((newSession) => {
            if (newSession) {
              sessionData = newSession;
              return this.sessionManager.refreshToken(token, newSession);
            } else {
              return Promise.resolve(token);
            }
          })
          .then((validToken) => {
            if (validToken !== token) {
              let options: express.CookieOptions = null;
              if (sessionData.persistent) options = { expires: moment().add(1, 'y').toDate() };
              response.cookie(this.config.sessionCookieName, validToken, options);
            } else {
              request.session = sessionData;
              request.token = validToken;
              next();
            }
          })
          .catch((error) => {
            next(error);
          });
      } else {
        response.sendStatus(HttpResponseStatus.NOT_AUTHENTICATED);
      }
    };
  }

  checkAtLeastOnePermission(permissions: string[]): express.RequestHandler {
    return (request: SessionRequest, response: Response, next: NextFunction) => {
      let token: string = request.cookies[this.config.sessionCookieName];
      if (token) {
        let sessionData: SessionPayload = null;
        return this.sessionManager.get(token)
          .then((data: SessionPayload) => {
            sessionData = data;
            return this.sessionManager.checkRefresh(token);
          })
          .then((newSession) => {
            if (newSession) {
              sessionData = newSession;
              return this.sessionManager.refreshToken(token, newSession);
            } else {
              return Promise.resolve(token);
            }
          })
          .then((validToken) => {
            if (validToken !== token) {
              let options: express.CookieOptions = null;
              if (sessionData.persistent) options = { expires: moment().add(1, 'y').toDate() };
              response.cookie(this.config.sessionCookieName, validToken, options);
            }
            let authorized = false;
            if (!authorized) {
              response.sendStatus(HttpResponseStatus.NOT_AUTHORIZED);
            } else {
              request.session = sessionData;
              request.token = validToken;
              next();
            }
          })
          .catch((error) => {
            next(error);
          });
      } else {
        response.sendStatus(HttpResponseStatus.NOT_AUTHENTICATED);
      }
    };
  }
}