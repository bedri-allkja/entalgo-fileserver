import * as jwt from 'jsonwebtoken';
import { Config } from '../config';
import * as redis from 'redis';
import { RedisClient } from 'redis';
import { v1 } from 'uuid';

enum RedisDb {
  TOKEN_SECRETS = 0,
  USER_TOKENS = 1,
  TOKEN_TO_MODIFY = 2
}

export interface SessionPayload {
  idUser: string;
  idOrganization: string;
  persistent: boolean;
}

export class SessionManager {
  private redisClientTokens: RedisClient;
  private redisClientUsers: RedisClient;
  private redisClientTokenToModify: RedisClient;
  constructor(private config: Config) {
    let optionsTokens = {
      ...config.redisOptions,
      db: RedisDb.TOKEN_SECRETS
    };
    let optionsUsers = {
      ...config.redisOptions,
      db: RedisDb.USER_TOKENS
    };
    let optionsTokenToModify = {
      ...config.redisOptions,
      db: RedisDb.TOKEN_TO_MODIFY
    };
    this.redisClientTokens = redis.createClient(optionsTokens);
    this.redisClientUsers = redis.createClient(optionsUsers);
    this.redisClientTokenToModify = redis.createClient(optionsTokenToModify);
  }

  /**
   * Create JWT token
   * @param sessionData session data
   * @param expireIn expiration in seconds
   */
  private signToken(sessionData: SessionPayload, secret: string, expireIn: number): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      jwt.sign(sessionData, secret, { expiresIn: expireIn }, (error, token) => {
        if (error) {
          reject(error);
        } else {
          resolve(token);
        }
      });
    });
  }

  /**
  * Verify if token is a valid JWT
  * @param token JWT token
  * @param secret private key with which the token is signed 
  */
  private verifyToken(token: string, secret: string): Promise<SessionPayload> {
    return new Promise<SessionPayload>((resolve, reject) => {
      jwt.verify(token, secret, (error, decoded: SessionPayload) => {
        if (error) {
          reject(error);
        } else if (!decoded) {
          reject(new Error('Token is invalid'));
        } else {
          resolve(decoded);
        }
      });
    });
  }

  /**
   * Store new Token into Redis
   * @param userId User's identity
   * @param token JWT token
   * @param secret private key with which the token is signed 
   * @param expireIn Token expiration in seconds
   */
  private storeNewToken(userId: string, token: string, secret: string, expireIn: number): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      let redisClient = redis.createClient(this.config.redisOptions);
      redisClient.multi()
        .select(RedisDb.TOKEN_SECRETS)
        .set(token, secret, 'EX', expireIn)
        .select(RedisDb.USER_TOKENS)
        .lpush(userId.toString(), token)
        .exec((error) => {
          redisClient.quit();
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        });
    });
  }

  /**
   * Get secret with wich token is signed
   * @param token JWT token
   */
  private getSecret(token: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      if (token) {
        this.redisClientTokens.get(token, (error_1, secret) => {
          if (error_1) {
            reject(error_1);
          } else {
            resolve(secret);
          }
        });
      } else {
        reject(new Error('Empty token'));
      }
    });
  }


  /**
   * Create a new JWT and store it into Redis
   * @param sessionData session data
   * @param rememberMe If true the session will expire in 1 year, otherwise in 3 months
   */
  public set(sessionData: SessionPayload): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      let expireIn: number = sessionData.persistent ? this.config.sessionExpiration.long : this.config.sessionExpiration.short;
      let jwtToken: string = null;
      let secret: string = v1();
      this.signToken(sessionData, secret, expireIn)
        .then((token) => {
          jwtToken = token;
          return this.storeNewToken(sessionData.idUser, jwtToken, secret, expireIn);
        })
        .then(() => {
          resolve(jwtToken);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  /**
   * Mark token as "To be refreshed" with new data
   * @param token JWT token
   * @param sessionData new session Data
   */
  public update(token: string, sessionData: SessionPayload): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.redisClientTokenToModify.set(token, JSON.stringify(sessionData), (error_1) => {
        if (error_1) {
          reject(error_1);
        } else {
          resolve();
        }
      });
    });
  }

  /**
   * Check if JWT token is signed as "To be refreshed"
   * @param token JWT token
   */
  public checkRefresh(token: string): Promise<SessionPayload> {
    return new Promise<SessionPayload>((resolve, reject) => {
      this.redisClientTokenToModify.get(token, (error, result) => {
        if (error) {
          reject(error);
        } else {
          if (result) {
            resolve(JSON.parse(result));
          } else {
            resolve(null);
          }
        }
      });
    });
  }

  /**
   * Remove old JWT token and create a new one with new data
   * @param token JWT token to be refreshed
   * @param sessionData Session data
   */
  public refreshToken(token: string, sessionData: SessionPayload): Promise<string> {
    return new Promise((resolve, reject) => {
      this.removeToken(token, sessionData.idUser)
        .then(() => {
          return this.set(sessionData);
        })
        .then((newToken) => {
          resolve(newToken);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  /**
   * Get session data from a JWT
   * @param token JWT token
   */
  public get(token: string): Promise<SessionPayload> {
    return new Promise((resolve, reject) => {
      this.getSecret(token)
        .then((secret) => {
          return this.verifyToken(token, secret);
        })
        .then((data) => {
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  /**
   * Get user's valit tokens
   * @param userId user's identity
   */
  public getUserValidTokes(userId: number): Promise<string[]> {
    return new Promise((resolve, reject) => {
      this.redisClientUsers.lrange(userId.toString(), 0, -1, (error_1, values) => {
        if (error_1) {
          reject(error_1);
        } else {
          resolve(values);
        }
      });
    });
  }


  /**
   * Remove JWT token from Redis
   * @param token JWT token
   * @param userId User's identity 
   */
  public removeToken(token: string, userId: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      let redisClient = redis.createClient(this.config.redisOptions);
      redisClient.multi()
        .select(RedisDb.TOKEN_SECRETS)
        .del(token)
        .select(RedisDb.USER_TOKENS)
        .lrem(userId.toString(), 0, token)
        .select(RedisDb.TOKEN_TO_MODIFY)
        .del(token)
        .exec((error) => {
          redisClient.quit();
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        });
    });
  }
  /**
   * Close all redis client connections
   */
  public end(): void {
    this.redisClientTokens.quit();
    this.redisClientUsers.quit();
    this.redisClientTokenToModify.quit();
  }
}