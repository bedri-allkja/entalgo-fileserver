import * as express from "express";
import { Router, Response, NextFunction } from "express";
import * as multer from "multer";
import * as path from "path";
import * as uuid from "uuid";
import { Environment, HttpResponseStatus } from "../environment";
import { SessionRequest } from '../middlewares/session-middleware';

export class UsersController {
  public router: Router;
  public root: string;
  private uploadMiddleware: any;
  private filesPath: string;

  constructor(private env: Environment) {
    this.router = express.Router();

    this.filesPath = path.join(this.env.config.fileserver.root, this.env.config.fileserver.folders["users"]);
    this.uploadMiddleware = multer({
      limits: env.config.limits,
      storage: multer.diskStorage({
        destination: (request, file, callback) => {
          callback(null, this.filesPath);
        },
        filename: (request, file, callback) => {
          let extension = path.extname(file.originalname);
          callback(null, uuid.v1() + extension);
        }
      })
    });

    this.router.put("/", this.env.session.checkAuthentication(), this.uploadMiddleware.single("file"),
      (request: SessionRequest, response) => this.upload(request, response)
    );
  }

  public upload(request: SessionRequest, response: Response) {
    if (request.file) {
      response.send({
        filename: request.file.originalname,
        stored: request.file.filename
      });
    } else {
      response.sendStatus(HttpResponseStatus.MISSING_PARAMS);
    }
  }
}
