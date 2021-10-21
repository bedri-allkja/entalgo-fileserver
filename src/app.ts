import * as express from "express";
import { Request, Response, NextFunction, Express } from "express";
import { Environment, HttpResponseStatus } from "./environment";
import * as path from "path";
import * as cors from "cors";
import * as fse from "fs-extra";
import { UsersController } from "./controllers/users-controller";
import { CSVController } from "./controllers/csv-controller";

export class App {
  //ref to Express instance
  public express: Express;
  public env: Environment;

  // Run configuration methods on the Express instance
  constructor() {
    this.env = new Environment();
    this.express = express();
    this.express.use(express.json({limit: this.env.config.bodyParserLimit}));
    this.express.use(express.urlencoded({ extended: true }));
    this.express.use(cors());
    this.express.use(express.static(this.env.config.fileserver.root));
    const users = new UsersController(this.env);
    const csv = new CSVController(this.env);
    this.express.use("/files/v1/users", users.router);
    this.express.use("/files/v1/csv", csv.router);
    this.express.use("/healthcheck", (request: Request, response: Response) => {
      response.send({ uptime: process.uptime() });
    });
    this.express.use((error: any, request: Request, response: Response, next: NextFunction) => {
      console.log('Error files: ', error);
      if (!error) {
        next();
      } else if (error.message === "unexpected end of file" || error.message === "Could not find MIME for Buffer <null>") {
        response.sendStatus(HttpResponseStatus.MISSING_PARAMS);
      } else if (error.name === "JsonWebTokenError") {
        this.env.logger.error(error.status, error.message);
        response.sendStatus(HttpResponseStatus.NOT_AUTHORIZED);
      } else if (error.stack && error.stack.indexOf("MulterError: Unexpected field") >= 0) {
        response.sendStatus(HttpResponseStatus.MISSING_PARAMS);
      } else {
        if (error.status && error.status !== HttpResponseStatus.SERVER_ERROR) {
          if (error.errors && error.errors.length) {
            let data = error.errors.map((item: any) => {
              return item.message;
            });
            response.status(error.status).send(data);
          } else {
            response.sendStatus(error.status);
          }
        } else {
          this.env.logger.error(request.url, error.stack);
          response.sendStatus(HttpResponseStatus.SERVER_ERROR);
        }
      }
    });
    this.ensureFilesystem();
  }

  ensureFilesystem(): void {
    for (let p in this.env.config.fileserver.folders) {
      let pathDir = path.join(this.env.config.fileserver.root, this.env.config.fileserver.folders[p]);
      fse.ensureDirSync(pathDir);
    }
  }
}
