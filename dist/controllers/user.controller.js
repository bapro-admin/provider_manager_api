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
exports.deleteUser = exports.updateUser = exports.createUser = exports.getUser = exports.getUsers = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
//import User from "../models/user.model"
const models_1 = require("../models");
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield models_1.User.findAll();
    res.json({
        users
    });
});
exports.getUsers = getUsers;
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = yield models_1.User.findByPk(id);
    if (user) {
        res.json({
            user
        });
    }
    else {
        res.status(404).json({
            msg: 'Usuario no encontrado'
        });
    }
});
exports.getUser = getUser;
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = req;
    try {
        const existEmail = yield models_1.User.findOne({
            where: {
                username: body.username
            }
        });
        if (existEmail) {
            return res.status(400).json({
                msg: 'El email que deseas registrar ya existe'
            });
        }
        const salt = bcryptjs_1.default.genSaltSync();
        const newUser = yield models_1.User.create(body);
        newUser.password = bcryptjs_1.default.hashSync(newUser.password, salt);
        yield newUser.save();
        res.json(newUser);
    }
    catch (error) {
        console.log("ERROR", error);
        res.status(500).json({
            msg: 'Ocurrio un problema al realizar tu solicitud',
            error
        });
    }
});
exports.createUser = createUser;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { body } = req;
    try {
        const user = yield models_1.User.findByPk(id);
        if (!user) {
            return res.status(404).json({
                msg: 'No existe un usuario con el id ' + id
            });
        }
        if (body.email) {
            const existEmail = yield models_1.User.findOne({
                where: {
                    username: body.email
                }
            });
            if (existEmail) {
                return res.status(400).json({
                    msg: 'El email que deseas actualizar ya existe'
                });
            }
        }
        yield user.update(body);
        res.json(user);
    }
    catch (error) {
        res.status(500).json({
            msg: 'Ocurrio un problema al realizar tu solicitud',
            error
        });
    }
});
exports.updateUser = updateUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const user = yield models_1.User.findByPk(id);
        if (!user) {
            return res.status(404).json({
                msg: 'No existe un usuario con el id' + id
            });
        }
        yield user.destroy();
        res.json({
            msg: 'El usuario ha sido eliminado correctamente'
        });
    }
    catch (error) {
        res.status(500).json({
            msg: 'Ocurrio un problema al realizar tu solicitud',
            error
        });
    }
});
exports.deleteUser = deleteUser;
