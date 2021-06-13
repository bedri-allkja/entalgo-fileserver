/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import * as Sequelize from "sequelize";
import { Model } from "sequelize";
import * as _ from "lodash";
import { OrganizationModel } from "./organization-model";

export interface UserAttributes {
  id: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  organisation_id?: string;
  title?: string;
  password: string;
  role?: string;
  google_access_token?: string;
  account_status?: string;
  last_user_agent?: string;
  last_ip?: string;
  business_email: string;
  email?: string;
  profile_picture?: string;
  referred_by?: string;
  last_login?: Date;
}

export class UserModel extends Model {
  id: string;
  first_name: string;
  last_name: string;
  business_email: string;
  phone_number?: string;
  organisation_id?: string;
  title: string;
  password: string;
  last_login: Date;
  organization?: OrganizationModel;
  blocked: boolean;
  deleted: boolean;
  role: string;
  google_access_token: string;
  account_status: string;
  last_user_agent: string;
  last_ip: string;
  email: string;
  profile_picture: string;
  referred_by: string;
  createdAt: Date;
  updatedAt: Date;
  //dataValues: any;

  static initModel(connection: Sequelize.Sequelize) {
    UserModel.init(
      {
        id: { type: Sequelize.UUIDV4, primaryKey: true },
        first_name: { type: Sequelize.STRING, allowNull: false },
        last_name: { type: Sequelize.STRING },
        profile_picture: { type: Sequelize.STRING },
        business_email: { type: Sequelize.STRING, unique: true, validate: { isEmail: true } },
        email: { type: Sequelize.STRING },
        password: { type: Sequelize.STRING, allowNull: false },
        phone_number: { type: Sequelize.STRING },
        organisation_id: { type: Sequelize.STRING, allowNull: false },
        title: { type: Sequelize.STRING },
        role: { type: Sequelize.STRING },
        google_access_token: { type: Sequelize.STRING },
        account_status: { type: Sequelize.STRING },
        last_user_agent: { type: Sequelize.STRING },
        last_ip: { type: Sequelize.STRING },
        referred_by: { type: Sequelize.STRING },
        blocked: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
        deleted: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
        last_login: { type: Sequelize.DATE },
        createdAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.NOW },
        updatedAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.NOW }
      },
      {
        sequelize: connection,
        timestamps: false,
        freezeTableName: true,
        tableName: "users"
      }
    );
  }

  static initAssociations() {
    UserModel.belongsTo(OrganizationModel, { foreignKey: 'organisation_id', targetKey: 'id', as: 'organization' });
  }
}
