import * as express from "express";
import { Router, Response, NextFunction } from "express";
import * as multer from "multer";
import * as path from "path";
import * as uuid from "uuid";
import { Environment, HttpResponseStatus } from "../environment";
import { SessionRequest } from "../middlewares/session-middleware";
import { CsvFileAttributes, CsvFilesModel } from "../model/csv-files-model";

export class CSVController {
  public router: Router;
  public root: string;
  private uploadMiddleware: any;
  private filesPath: string;

  constructor(private env: Environment) {
    this.root = "csv";
    this.router = express.Router();
    this.filesPath = path.join(this.env.config.fileserver.root, this.env.config.fileserver.folders["csv"]);

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

    this.router.put(
      "/",
      this.env.session.checkAuthentication(),
      this.uploadMiddleware.single("file"),
      (request: SessionRequest, response, next) => this.upload(request, response, next)
    );
  }

  public async upload(request: SessionRequest, response: Response, next: NextFunction) {
    //     try {

    //     } catch (error) {
    //       next(error);
    //     }

    console.log('content type log: ', request.headers['content-type']);
    if (request.file) {
      return response.status(400).send({ status: { code: 400, message: 'WARNING' }, body: { data: 'Only CSV file is allowed!' } });
    }
    if (request.file) {
      // store data on database
      const newCsvFile: CsvFileAttributes = {
        id: request.file.filename.substr(0, request.file.filename.lastIndexOf('.')),
        organisation_id: request.session.idOrganization,
        user_id: request.session.idUser,
        file_name: request.file.originalname,
        file_size: request.file.size,
        file_type: request.file.mimetype
      };
      const createdFile = await CsvFilesModel.create(newCsvFile);
      response.json({ status: { code: 200, message: 'SUCCESS' }, body: { data: createdFile } });
    } else {
      //response.sendStatus(HttpResponseStatus.MISSING_PARAMS);
      response.json({ status: { code: 400, message: 'WARNING' }, body: { data: "MISSING PARAMS" } });
    }
  }
}
