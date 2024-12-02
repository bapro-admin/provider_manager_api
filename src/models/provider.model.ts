import { DataTypes, Model, Optional } from "sequelize";
import db from "../db/connection";
import User from "./user.model";

    interface ProviderAttributes {
        id_provider: number;
        commercialName: string;
        businessName: string;
        phone?: string;
        rfc?: string;
        address?: string;
        sellerFullName?: string;
        created_at?: Date;
        updated_at?: Date;
        operatorId?: number;
    }

    interface ProviderCreationAttributes extends Optional<ProviderAttributes, "id_provider"> {}

    class Provider extends Model<ProviderAttributes, ProviderCreationAttributes> implements ProviderAttributes {
        public id_provider!: number;
        public commercialName!: string;
        public businessName!: string;
        public phone?: string;
        public rfc?: string;
        public address?: string;
        public sellerFullName?: string;
        public readonly created_at!: Date;
        public readonly updated_at!: Date;
        public operatorId?: number;

        public operator?: User;
    }

// provider.model.ts
Provider.init(
    {
        id_provider: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        commercialName: {
            type: DataTypes.STRING(100),
            allowNull: false,
            field: "commercial_name",
        },
        businessName: {
            type: DataTypes.STRING(100),
            allowNull: false,
            field: "business_name",
        },
        phone: {
            type: DataTypes.STRING(20),
            allowNull: true,
        },
        rfc: {
            type: DataTypes.STRING(13),
            allowNull: true,
        },
        address: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        sellerFullName: {
            type: DataTypes.STRING(100),
            allowNull: true,
            field: "seller_full_name",
        },
        operatorId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: "operator_id",
        },
    },
    {
        sequelize: db,
        tableName: "providers",
        createdAt: "created_at",
        updatedAt: "updated_at",
    }
);

export default Provider;

