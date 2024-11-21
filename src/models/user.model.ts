import { DataTypes, Model, Optional } from "sequelize";
import db from "../db/connection";
import Provider from "./provider.model";

interface UserAttributes {
    id_user: number;
    username: string;
    password: string;
    role: string;
    created_at?: Date;
    updated_at?: Date;
}

interface UserCreationAttributes extends Optional<UserAttributes, "id_user"> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    public id_user!: number;
    public username!: string;
    public password!: string;
    public role!: string;
    public readonly created_at!: Date;
    public readonly updated_at!: Date;
}

User.init(
    {
        id_user: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        username: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        role: {
            type: DataTypes.STRING(10),
            allowNull: false,
        },
    },
    {
        sequelize: db,
        tableName: "users",
        createdAt: "created_at",
        updatedAt: "updated_at",
    }
);

export default User;