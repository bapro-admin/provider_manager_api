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
exports.register = exports.doLogin = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const models_1 = require("../models");
const generar_jwt_1 = require("../helpers/generar-jwt");
const doLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        //verify if email exist
        const user = yield models_1.User.findOne({
            where: {
                username: username
            }
        });
        if (!user) {
            return res.status(400).json({
                msg: "Usuario no encontrado en la base de datos"
            });
        }
        //verify password
        const validPassword = bcryptjs_1.default.compareSync(password, user.password);
        if (!validPassword) {
            return res.status(400).json({
                msg: "Usuario o contraseña no son correctos"
            });
        }
        //generate JWT
        const token = yield (0, generar_jwt_1.generarJWT)(user.id_user);
        res.json({
            msg: 'LOGIN OK',
            user,
            token
        });
    }
    catch (error) {
        console.log('OCURRIO UN ERROR', error);
        return res.status(500).json({
            msg: "No se pudo realizar tu solicitud"
        });
    }
});
exports.doLogin = doLogin;
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password, role, } = req.body;
    const status = true;
    const newUser = models_1.User.build({
        username,
        role,
        password,
    });
    try {
        //validamos si el usuario que quieres registrar ya existe
        const existEmail = yield models_1.User.findOne({
            where: {
                username: username
            }
        });
        if (existEmail) {
            return res.status(400).json({
                msg: 'El usuario que deseas registrar ya existe'
            });
        }
        //encriptar contraseña
        const salt = bcryptjs_1.default.genSaltSync();
        newUser.password = bcryptjs_1.default.hashSync(newUser.password, salt);
        yield newUser.save();
        res.json({
            msg: 'Usuario registrado correctamente',
            user: newUser
        });
    }
    catch (error) {
        res.status(500).json({
            msg: 'Ocurrio un problema al realizar tu solicitud',
            error
        });
    }
});
exports.register = register;
