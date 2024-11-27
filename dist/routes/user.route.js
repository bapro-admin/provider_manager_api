"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const valida_jwt_1 = require("../middlewares/valida-jwt");
const checkAdminRole_1 = require("../middlewares/checkAdminRole");
const router = (0, express_1.Router)();
router.get('/', [
    valida_jwt_1.validarJWT,
    checkAdminRole_1.checkAdminRole,
], user_controller_1.getUsers);
router.get('/:id', [
    valida_jwt_1.validarJWT,
    checkAdminRole_1.checkAdminRole,
], user_controller_1.getUser);
router.post('/', [
    valida_jwt_1.validarJWT,
    checkAdminRole_1.checkAdminRole
], user_controller_1.createUser);
router.put('/:id', [
    valida_jwt_1.validarJWT,
    checkAdminRole_1.checkAdminRole
], user_controller_1.updateUser);
router.delete('/:id', [
    valida_jwt_1.validarJWT,
    checkAdminRole_1.checkAdminRole
], user_controller_1.deleteUser);
exports.default = router;
