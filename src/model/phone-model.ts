/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import * as Sequelize from "sequelize";
import { Model } from "sequelize";

import { CompanyModel } from "./company-model";
import { PersonModel } from "./person-model";


export interface PhoneAttributes {
  id: string;
  company_id: string;
  person_id: string;
  number: string;
  type: string;
  source: string;
}

export class PhoneModel extends Model {
  id: string;
  company_id: string;
  person_id: string;
  number: string;
  type: string;
  source: string;
  company?: CompanyModel;
  //dataValues: any;

  static initModel(connection: Sequelize.Sequelize) {
    PhoneModel.init(
      {
        id: { type: Sequelize.UUIDV4, primaryKey: true },
        company_id: { type: Sequelize.STRING },
        number: { type: Sequelize.STRING },
        type: { type: Sequelize.STRING },
        source: { type: Sequelize.STRING },
        createdAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.NOW },
        updatedAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.NOW }
      },
      {
        sequelize: connection,
        timestamps: false,
        freezeTableName: true,
        tableName: "phones"
      }
    );
  }

  static initAssociations() {
    PhoneModel.belongsTo(CompanyModel, { foreignKey: 'company_id', targetKey: 'id', as: 'comapny' });
    PhoneModel.belongsTo(PersonModel, { foreignKey: 'person_id', targetKey: 'id', as: 'person' });
  }
}
