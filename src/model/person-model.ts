/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import * as Sequelize from "sequelize";
import { Model } from "sequelize";

import { CompanyModel } from "./company-model";

export interface PersonAttributes {
  id: string;
  company_id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  gender: string;
  title: string;
  linkedin: string;
  twitter: string;
  facebook: string;
  instagram: string;
  tiktok: string;
  address: string;
  source: string;
}

export class PersonModel extends Model {
  id: string;
  company_id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  gender: string;
  title: string;
  linkedin: string;
  twitter: string;
  facebook: string;
  instagram: string;
  tiktok: string;
  address: string;
  source: string;

  static initModel(connection: Sequelize.Sequelize) {
    PersonModel.init(
      {
        id: { type: Sequelize.UUIDV4, primaryKey: true },
        company_id: { type: Sequelize.STRING },
        first_name: { type: Sequelize.STRING },
        last_name: { type: Sequelize.STRING },
        full_name: { type: Sequelize.STRING, },
        gender: { type: Sequelize.STRING },
        title: { type: Sequelize.STRING },
        linkedin: { type: Sequelize.STRING },
        twitter: { type: Sequelize.STRING },
        facebook: { type: Sequelize.STRING },
        instagram: { type: Sequelize.STRING },
        tiktok: { type: Sequelize.STRING },
        address: { type: Sequelize.STRING },
        source: { type: Sequelize.STRING },
        createdAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.NOW },
        updatedAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.NOW }
      },
      {
        sequelize: connection,
        timestamps: false,
        freezeTableName: true,
        tableName: "persons"
      }
    );
  }

  static initAssociations() {
    PersonModel.belongsTo(CompanyModel, { foreignKey: 'company_id', targetKey: 'id', as: 'company' });
  }
}
