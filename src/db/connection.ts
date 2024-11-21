import { Sequelize } from "sequelize";
import * as dotenv from "dotenv";

// Cargar variables de entorno
dotenv.config();

// Crear la instancia de Sequelize usando valores del .env
const db = new Sequelize(
    process.env.DB_NAME as string,   // Nombre de la base de datos
    process.env.DB_USER as string,  // Usuario de la base de datos
    process.env.DB_PASSWORD as string, // Contraseña
    {
        host: process.env.DB_HOST,  // Host
        dialect: process.env.DB_DIALECT as "mysql" | "postgres" | "sqlite" | "mssql", // Dialecto
        port: Number(process.env.DB_PORT), // Puerto
    }
);

export default db;