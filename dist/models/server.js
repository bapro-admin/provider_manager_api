"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//inyeccion de dependencias
const express_1 = __importDefault(require("express"));
const auth_route_1 = __importDefault(require("../routes/auth.route"));
const user_route_1 = __importDefault(require("../routes/user.route"));
const provider_route_1 = __importDefault(require("../routes/provider.route"));
const cors_1 = __importDefault(require("cors"));
const connection_1 = __importDefault(require("../db/connection"));
class Server {
    constructor() {
        this.apiRoutes = {
            auth: '/api/auth',
            users: '/api/users',
            providers: '/api/providers',
        };
        this.app = (0, express_1.default)();
        this.port = process.env.PORT || '8000';
        //configuramos middlewares y rutas
        this.dbConfig();
        this.middlewares();
        this.routes();
    }
    routes() {
        this.app.use(this.apiRoutes.auth, auth_route_1.default);
        this.app.use(this.apiRoutes.users, user_route_1.default);
        this.app.use(this.apiRoutes.providers, provider_route_1.default);
    }
    //middlewares que se ejecutan antes de la ruta
    middlewares() {
        //cors
        this.app.use((0, cors_1.default)());
        //lectura del body
        this.app.use(express_1.default.json());
        //carpeta publica
        this.app.use(express_1.default.static('public'));
    }
    dbConfig() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield connection_1.default.authenticate();
            }
            catch (error) {
                console.log('OCURRIO UN ERROR AL LEVANTAR EL SERVIDOR');
                throw new Error(error);
            }
        });
    }
    listen() {
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en ' + this.port);
        });
    }
}
exports.default = Server;
