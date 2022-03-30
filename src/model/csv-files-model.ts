/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import * as Sequelize from "sequelize";
import { Model } from "sequelize";
import { OrganizationModel } from "./organization-model";
import { UserModel } from "./user-model";

export class CsvFilesModel extends Model {
  id: string;
  organisation_id: string;
  user_id: string;
  file_name: string;
  file_size: string;
  file_type: string;
  organization?: OrganizationModel;
  user?: UserModel;
  createdAt: Date;
  updatedAt: Date;

  static initModel(connection: Sequelize.Sequelize) {
    CsvFilesModel.init(
      {
        id: { type: Sequelize.UUIDV4, primaryKey: true },
        organisation_id: { type: Sequelize.STRING, allowNull: false },
        user_id: { type: Sequelize.STRING, allowNull: false },
        file_name: { type: Sequelize.STRING },
        file_size: { type: Sequelize.STRING },
        file_type: { type: Sequelize.STRING },
        createdAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.NOW },
        updatedAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.NOW }
      },
      {
        sequelize: connection,
        timestamps: false,
        freezeTableName: true,
        tableName: "csv_files"
      }
    );
  }

  static initAssociations() {
    CsvFilesModel.belongsTo(UserModel, { foreignKey: 'user_id', targetKey: 'id', as: 'user' });
    CsvFilesModel.belongsTo(OrganizationModel, { foreignKey: 'organisation_id', targetKey: 'id', as: 'organization' });
  }
}
