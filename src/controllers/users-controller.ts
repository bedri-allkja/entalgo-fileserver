import * as express from "express";
import { Router, Response, NextFunction } from "express";
import * as multer from "multer";
import * as path from "path";
import * as uuid from "uuid";
import { Environment, HttpResponseStatus } from "../environment";
import { SessionRequest } from '../middlewares/session-middleware';
import { UserModel } from "../model/user-model";
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
      (request: SessionRequest, response, next) => this.upload(request, response, next)
    );
  }

  public async upload(request: SessionRequest, response: Response, next: NextFunction) {
    try {
      if (request.file && request.file.mimetype !== 'image/png' && request.file.mimetype !== 'image/jpg' && request.file.mimetype !== 'image/jpeg') {
        //return response.status(400).send({ statuCode: HttpResponseStatus.MISSING_PARAMS, message: 'Only image are allowed!' });
        return response.status(400).send({ status: { code: 400, message: 'WARNING' }, body: { data: 'Only images are allowed!' } });
      }
      if (request.file) {
        await UserModel.update({
          profile_picture: request.file.filename
        }, {
          where: {
            id: request.session.idUser
          }
        });
        /* response.send({
          filename: request.file.originalname,
          stored: request.file.filename
        }); */
        response.json({ status: { code: 200, message: 'SUCCESS' }, body: { data: {
          filename: request.file.originalname,
          stored: request.file.filename
        } } });
      } else {
        //response.sendStatus(HttpResponseStatus.MISSING_PARAMS);
        response.json({ status: { code: 400, message: 'WARNING' }, body: { data: "MISSING PARAMS" } });
      }
    } catch (error) {
      next(error);
    }
  }
}
