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
exports.checkAdminRole = void 0;
const user_model_1 = __importDefault(require("../models/user.model")); // Ajusta el path según donde tengas el modelo
const checkAdminRole = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { authorUid } = req;
    try {
        const loggedUser = yield user_model_1.default.findByPk(authorUid);
        if ((loggedUser === null || loggedUser === void 0 ? void 0 : loggedUser.dataValues.role) === 'ADMIN') {
            next(); // Permite la continuación al siguiente middleware o controlador
        }
        else {
            res.status(403).json({
                msg: 'El usuario que intenta hacer esta acción no cuenta con suficientes privilegios'
            });
        }
    }
    catch (error) {
        res.status(500).json({
            msg: 'Error de servidor',
            error
        });
    }
});
exports.checkAdminRole = checkAdminRole;
