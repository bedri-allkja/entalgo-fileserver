/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import * as Sequelize from "sequelize";
import { Model } from "sequelize";
import { EmailModel } from "./email-model";
import { PersonModel } from "./person-model";
import { PhoneModel } from "./phone-model";
import { TechnologyModel } from "./technology-model";

export interface CompanyAttributes {
  id: string;
  name: string;
  logo: string;
  title: string;
  url: string;
  alternate_url: string;
  industry: string;
  status: string;
  status_message: string;
  company_size: number;
  founded: Date;
  type: string;
  alexa_rank: number;
  monthly_visits: number;
  monthly_ad_spent: number;
  address: string;
  country: string;
  state: string;
  city: string;
  zip: string;
  language: string;
  language_prob: string;
  facebook: string;
  instagram: string;
  twitter: string;
  linkedIn: string;
  pinterest: string;
  youtube: string;
  snapchat: string;
  vimeo: string;
  tiktok: string;
  spotify: string;
  salesforce_id: string;
  user_id: string;
  source: string;
}

export class CompanyModel extends Model {
  id: string;
  name: string;
  logo: string;
  title: string;
  url: string;
  alternate_url: string;
  industry: string;
  status: string;
  status_message: string;
  company_size: number;
  founded: Date;
  type: string;
  alexa_rank: string;
  monthly_visits: number;
  monthly_ad_spent: number;
  address: string;
  country: string;
  state: string;
  city: string;
  zip: string;
  language: string;
  language_prob: string;
  facebook: string;
  instagram: string;
  twitter: string;
  linkedIn: string;
  pinterest: string;
  youtube: string;
  snapchat: string;
  vimeo: string;
  tiktok: string;
  spotify: string;
  salesforce_id: string;
  user_id: string;
  source: string;
  createdAt: Date;
  updatedAt: Date;
  phones: PhoneModel[];
  emails: EmailModel[];
  persons: PersonModel[];
  technologies: TechnologyModel[];

  static initModel(connection: Sequelize.Sequelize) {
    CompanyModel.init(
      {
        id: { type: Sequelize.UUIDV4, primaryKey: true },
        name: { type: Sequelize.STRING, allowNull: false },
        logo: { type: Sequelize.STRING },
        title: { type: Sequelize.STRING },
        url: { type: Sequelize.STRING },
        alternate_url: { type: Sequelize.STRING },
        industry: { type: Sequelize.STRING },
        status: { type: Sequelize.STRING },
        status_message: { type: Sequelize.STRING },
        company_size: { type: Sequelize.INTEGER },
        founded: { type: Sequelize.DATE },
        type: { type: Sequelize.STRING },
        alexa_rank: { type: Sequelize.INTEGER },
        monthly_visits: { type: Sequelize.DOUBLE },
        monthly_ad_spent: { type: Sequelize.DOUBLE },
        address: { type: Sequelize.STRING },
        country: { type: Sequelize.STRING },
        state: { type: Sequelize.STRING },
        city: { type: Sequelize.STRING },
        zip: { type: Sequelize.STRING },
        language: { type: Sequelize.STRING },
        language_prob: { type: Sequelize.STRING },
        facebook: { type: Sequelize.STRING },
        instagram: { type: Sequelize.STRING },
        twitter: { type: Sequelize.STRING },
        linkedIn: { type: Sequelize.STRING },
        pinterest: { type: Sequelize.STRING },
        youtube: { type: Sequelize.STRING },
        snapchat: { type: Sequelize.STRING },
        vimeo: { type: Sequelize.STRING },
        tiktok: { type: Sequelize.STRING },
        spotify: { type: Sequelize.STRING },
        salesforce_id: { type: Sequelize.STRING },
        user_id: { type: Sequelize.STRING },
        source: { type: Sequelize.STRING },
        createdAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.NOW },
        updatedAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.NOW }
      },
      {
        sequelize: connection,
        timestamps: false,
        freezeTableName: true,
        tableName: "companies"
      }
    );
  }

  static initAssociations() {
    // CompanyModel.belongsTo(OrganizationModel, { foreignKey: "id_company", targetKey: "id", as: "company" });
    CompanyModel.hasMany(EmailModel, { foreignKey: 'company_id', as: 'emails' });
    CompanyModel.hasMany(PhoneModel, { foreignKey: 'company_id', as: 'phones' });
    CompanyModel.hasMany(PersonModel, { foreignKey: 'company_id', as: 'persons' });
    CompanyModel.hasMany(TechnologyModel, { foreignKey: 'company_id', as: 'technologies' });
  }
}
