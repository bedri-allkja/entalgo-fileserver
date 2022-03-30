/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Sequelize } from "sequelize";
import { OrganizationModel } from "./organization-model";
import { UserModel } from "./user-model";
import { PersonModel } from "./person-model";
import { CompanyModel } from "./company-model";
import { EmailModel } from "./email-model";
import { TechnologyModel } from "./technology-model";
import { PhoneModel } from "./phone-model";
import { CsvFilesModel } from "./csv-files-model";

export const initMySQLModels = (connection: Sequelize) => {
  CompanyModel.initModel(connection);
  OrganizationModel.initModel(connection);
  UserModel.initModel(connection);
  PersonModel.initModel(connection);
  EmailModel.initModel(connection);
  TechnologyModel.initModel(connection);
  PhoneModel.initModel(connection);
  CsvFilesModel.initModel(connection);

  CompanyModel.initAssociations();
  UserModel.initAssociations();
  PersonModel.initAssociations();
  EmailModel.initAssociations();
  TechnologyModel.initAssociations();
  PhoneModel.initAssociations();
  CsvFilesModel.initAssociations();
};
