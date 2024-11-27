"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const auth_controller_1 = require("../controllers/auth.controller");
const validarCampos_1 = require("../middlewares/validarCampos");
const router = (0, express_1.Router)();
router.post('/login', [
    (0, express_validator_1.check)('username', 'El correo es obligatorio').isEmail(),
    (0, express_validator_1.check)('password', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos_1.validarCampos
], auth_controller_1.doLogin);
router.post('/register', auth_controller_1.register);
exports.default = router;
