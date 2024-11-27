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
exports.validarJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../models/user.model"));
const validarJWT = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({
            msg: "Token no valido"
        });
    }
    try {
        const TokenArray = token.split(" ");
        //validar que el usuario exista en base de datos
        const decoded = jsonwebtoken_1.default.verify(TokenArray[1], process.env.SECRETKEY);
        const user = yield user_model_1.default.findByPk(decoded.uid);
        if (user) {
            req.authorUid = decoded.uid;
            next();
        }
        else {
            res.status(401).json({
                msg: 'No autorizado. Token inválido o no proporcionado.'
            });
        }
    }
    catch (error) {
        return res.status(401).json({
            msg: "Token no valido",
            error
        });
    }
});
exports.validarJWT = validarJWT;
