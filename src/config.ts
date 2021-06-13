import * as Sequelize from "sequelize";
import { ClientOpts } from 'redis';

export interface DbConfig {
  database: string;
  user: string;
  password: string;
  options: Sequelize.Options;
}

export interface SessionExpiration {
  short: number;
  long: number;
}

export interface Config {
  db: DbConfig;
  logLevel: number;
  defaultPort: number;
  root: string;
  redisOptions: ClientOpts;
  sessionCookieName: string;
  sessionExpiration: SessionExpiration;
  fileserver: {
    root: string;
    tmp: string;
    folders: {
      [key: string]: string;
    };
  };
  filesize: {
    [key: string]: number;
  };
  limits: {
    fileSize: number;
    fieldSize: number;
  };
  bodyParserLimit: string;
}
