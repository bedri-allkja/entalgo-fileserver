import { Sequelize } from 'sequelize';
import { Config } from './config';
import { Logger } from './lib/logger';
import { SessionMiddleware } from './middlewares/session-middleware';
import { initMySQLModels } from './model/init';

export enum HttpResponseStatus {
  NO_CONTENT = 204,
  NOT_AUTHENTICATED = 401,
  NOT_AUTHORIZED = 403,
  MISSING_PARAMS = 400,
  NOT_FOUND = 404,
  SERVER_ERROR = 500
}

export class Environment {
  public config: Config;
  public ynDbConnection: Sequelize;
  public logger: Logger;
  public session: SessionMiddleware;

  constructor() {
    this.config = require('../config/config.json');
    this.logger = new Logger(this.config.logLevel);
    this.config.db.options.logging = this.logger.sql.bind(this.logger);
    this.ynDbConnection = new Sequelize(this.config.db.database,
      this.config.db.user,
      this.config.db.password,
      this.config.db.options
    );
    initMySQLModels(this.ynDbConnection);
    this.session = new SessionMiddleware(this.ynDbConnection, this.config, this.logger);
  }
}