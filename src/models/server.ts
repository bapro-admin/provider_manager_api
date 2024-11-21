//inyeccion de dependencias
import express, { Application } from "express";

import authRoutes from "../routes/auth.route";
import userRoutes from "../routes/user.route";
import providerRoutes from '../routes/provider.route';

import cors from 'cors'
import db from "../db/connection";

class Server {

    private app: Application;
    private port: string;
    private apiRoutes = { //implement later
        auth: '/api/auth',
        users: '/api/users',
        providers: '/api/providers', 
    }

    constructor(){
        this.app = express();
        this.port = process.env.PORT || '8000';

        //configuramos middlewares y rutas
        this.dbConfig();
        this.middlewares();
        this.routes();
    }

    routes() {
        this.app.use(this.apiRoutes.auth, authRoutes)
        this.app.use(this.apiRoutes.users, userRoutes) 
        this.app.use(this.apiRoutes.providers, providerRoutes)
    }

    //middlewares que se ejecutan antes de la ruta
    middlewares(){
        //cors
        this.app.use(cors())

        //lectura del body
        this.app.use(express.json())

        //carpeta publica
        this.app.use(express.static('public'))
    }

    async dbConfig(){
        try {
            await db.authenticate();
        } catch (error: any) {
            console.log('OCURRIO UN ERROR AL LEVANTAR EL SERVIDOR')
            throw new Error(error)
        }
    }

    listen(){
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en ' + this.port)
        })
    }
}

export default Server