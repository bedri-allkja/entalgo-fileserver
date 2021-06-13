/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import * as Sequelize from "sequelize";
import { Model } from "sequelize";

import { CompanyModel } from "./company-model";
import { PersonModel } from "./person-model";

export interface EmailAttributes {
  id: string;
  company_id: string;
  person_id: string;
  email: string;
  type: string;
  domain: string;
  free: string;
  duration: string;
  accept_all: string;
  did_you_mean: string;
  disposable: string;
  mx_record: string;
  reason: string;
  role: string;
  score: string;
  smtp_provider: string;
  state: string;
  tag: string;
  user: string;
  result: string;
  message: string;
  source: string;
  validated: boolean;
}

export class EmailModel extends Model {
  id: string;
  company_id: string;
  person_id: string;
  email: string;
  type: string;
  domain: string;
  free: string;
  duration: string;
  accept_all: string;
  did_you_mean: string;
  disposable: string;
  mx_record: string;
  reason: string;
  role: string;
  score: string;
  smtp_provider: string;
  state: string;
  tag: string;
  user: string;
  result: string;
  message: string;
  source: string;
  validated: boolean;
  createdAt: Date;
  updatedAt: Date;

  static initModel(connection: Sequelize.Sequelize) {
    EmailModel.init(
      {
        id: { type: Sequelize.UUIDV4, primaryKey: true },
        company_id: { type: Sequelize.STRING },
        person_id: { type: Sequelize.STRING },
        email: { type: Sequelize.STRING },
        type: { type: Sequelize.STRING },
        domain: { type: Sequelize.STRING, },
        free: { type: Sequelize.STRING },
        duration: { type: Sequelize.STRING },
        accept_all: { type: Sequelize.STRING },
        did_you_mean: { type: Sequelize.STRING },
        disposable: { type: Sequelize.STRING },
        mx_record: { type: Sequelize.STRING },
        reason: { type: Sequelize.STRING },
        role: { type: Sequelize.STRING },
        score: { type: Sequelize.STRING },
        smtp_provider: { type: Sequelize.STRING },
        state: { type: Sequelize.STRING },
        tag: { type: Sequelize.STRING },
        user: { type: Sequelize.STRING },
        result: { type: Sequelize.STRING },
        message: { type: Sequelize.STRING },
        source: { type: Sequelize.STRING },
        validated: { type: Sequelize.BOOLEAN },
        createdAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.NOW },
        updatedAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.NOW }
      },
      {
        sequelize: connection,
        timestamps: false,
        freezeTableName: true,
        tableName: "emails"
      }
    );
  }

  static initAssociations() {
    EmailModel.belongsTo(CompanyModel, { foreignKey: 'company_id', targetKey: 'id', as: 'company' });
    EmailModel.belongsTo(PersonModel, { foreignKey: 'person_id', targetKey: 'id', as: 'person' });
  }
}
