import { DataTypes, Model } from "sequelize";
import * as Sequelize from "sequelize";

export interface videoAttributes {
    id: string;
    title: string;
    description?: object;
    metaDesc?: string;
    keywords?: string;
    createdAt?: Date;
}

export class videoDetail extends Model<videoAttributes> implements videoAttributes {
    createdAt: Date;
    description: object;
    keywords: string;
    metaDesc: string;
    title: string;
    id: string;

    static initModel(sequelize: Sequelize.Sequelize): typeof videoDetail {
        videoDetail.init({
            id: {
                type: DataTypes.UUID,
                allowNull: false,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true
            },
            title: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            description: {
                type: DataTypes.STRING,
            },
            metaDesc: {
                type: DataTypes.STRING,
            },
            keywords: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            createdAt: {
                type: DataTypes.DATE,
                allowNull: true,
                defaultValue: Sequelize.Sequelize.fn('now'),
                field: 'created_at'
            },
        }, {
            sequelize,
            tableName: 'video_detail',
            schema: 'public',
            timestamps: true,
            paranoid: true,
            underscored: true,
            indexes: [
                {
                    name: "id",
                    unique: true,
                    fields: [
                        { name: "id" },
                    ]
                },
            ]
        });
        return videoDetail;
    }
}
