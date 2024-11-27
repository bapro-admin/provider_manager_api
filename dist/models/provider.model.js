"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../db/connection"));
class Provider extends sequelize_1.Model {
}
// provider.model.ts
Provider.init({
    id_provider: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    commercialName: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
        field: "commercial_name",
    },
    businessName: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
        field: "business_name",
    },
    phone: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: true,
    },
    rfc: {
        type: sequelize_1.DataTypes.STRING(13),
        allowNull: true,
        unique: true,
    },
    address: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    sellerFullName: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: true,
        field: "seller_full_name",
    },
    operatorId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        field: "operator_id",
    },
}, {
    sequelize: connection_1.default,
    tableName: "providers",
    createdAt: "created_at",
    updatedAt: "updated_at",
});
exports.default = Provider;
