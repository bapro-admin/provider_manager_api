"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const provider_controller_1 = require("../controllers/provider.controller");
const valida_jwt_1 = require("../middlewares/valida-jwt");
const checkAdminRole_1 = require("../middlewares/checkAdminRole");
const router = (0, express_1.Router)();
router.get('/', [
    valida_jwt_1.validarJWT
], provider_controller_1.listProviders);
router.get('/storedProviders', [
    valida_jwt_1.validarJWT
], provider_controller_1.listProviderFields);
router.post('/check-existence', [
    valida_jwt_1.validarJWT
], provider_controller_1.checkProviderExists);
router.get('/:id', [
    valida_jwt_1.validarJWT
], provider_controller_1.getProvider);
router.post('/', [
    valida_jwt_1.validarJWT
], provider_controller_1.createProvider);
router.put('/:id', [
    valida_jwt_1.validarJWT
], provider_controller_1.updateProvider);
router.delete('/:id', [
    valida_jwt_1.validarJWT
], provider_controller_1.deleteProvider);
router.post('/export', [
    valida_jwt_1.validarJWT,
    checkAdminRole_1.checkAdminRole,
], provider_controller_1.exportProvidersToExcel);
exports.default = router;
