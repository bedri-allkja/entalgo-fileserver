/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import * as Sequelize from "sequelize";
import { Model } from "sequelize";

import { CompanyModel } from "./company-model";


export interface TechnologyAttributes {
  id: string;
  company_id: string;
  name: string;
  type: string;
  version: string;
  source: string;
}

export class TechnologyModel extends Model {
  id: string;
  company_id: string;
  name: string;
  type: string;
  version: string;
  source: string;
  company?: CompanyModel;
  //dataValues: any;

  static initModel(connection: Sequelize.Sequelize) {
    TechnologyModel.init(
      {
        id: { type: Sequelize.UUIDV4, primaryKey: true },
        company_id: { type: Sequelize.STRING, allowNull: false },
        name: { type: Sequelize.STRING },
        type: { type: Sequelize.STRING },
        version: { type: Sequelize.STRING },
        source: { type: Sequelize.STRING },
        createdAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.NOW },
        updatedAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.NOW }
      },
      {
        sequelize: connection,
        timestamps: false,
        freezeTableName: true,
        tableName: "technologies"
      }
    );
  }

  static initAssociations() {
    TechnologyModel.belongsTo(CompanyModel, { foreignKey: 'company_id', targetKey: 'id', as: 'comapny' });
  }
}
