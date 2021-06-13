/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import * as Sequelize from "sequelize";
import { Model } from "sequelize";


export interface OrganizationAttributes {
  id: string;
  name: string;
  industry?: string;
  address?: string;
  description?: string;
  enabled?: boolean;
  deleted?: boolean;
  logo?: string;
  size?: number;
  admin_id?: string;
}

export class OrganizationModel extends Model {
  id: string;
  name: string;
  website: string;
  industry: string;
  address: string;
  description: string;
  logo: string;
  size: number;
  enabled: boolean;
  deleted: boolean;
  admin_id: string;
  createdAt: Date;
  updatedAt: Date;

  static initModel(connection: Sequelize.Sequelize) {
    OrganizationModel.init(
      {
        id: { type: Sequelize.UUIDV4, primaryKey: true },
        name: { type: Sequelize.STRING, allowNull: false },
        website: { type: Sequelize.STRING },
        industry: { type: Sequelize.STRING },
        description: { type: Sequelize.STRING },
        logo: { type: Sequelize.STRING },
        admin_id: { type: Sequelize.STRING },
        address: { type: Sequelize.STRING },
        size: { type: Sequelize.INTEGER },
        enabled: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
        deleted: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },        
        createdAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.NOW },
        updatedAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.NOW }
      },
      {
        sequelize: connection,
        timestamps: false,
        freezeTableName: true,
        tableName: "organizations"
      }
    );
  }
}
