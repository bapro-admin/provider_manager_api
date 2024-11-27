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
exports.exportProvidersToExcel = exports.checkProviderExists = exports.listProviderFields = exports.deleteProvider = exports.updateProvider = exports.createProvider = exports.getProvider = exports.listProviders = void 0;
const models_1 = require("../models");
const sequelize_1 = require("sequelize");
const exceljs_1 = __importDefault(require("exceljs"));
const listProviders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { authorUid } = req;
    const { startDate, endDate } = req.query; // Fechas pasadas como query params
    // Convierte las fechas a objetos Date si se pasaron en la solicitud
    let whereCondition = {};
    if (startDate) {
        const startDateStr = String(startDate); // Asegura que es una cadena
        whereCondition.created_at = {
            [sequelize_1.Op.gte]: new Date(startDateStr), // Fecha de inicio (mayor o igual)
        };
    }
    if (endDate) {
        const endDateStr = String(endDate); // Asegura que es una cadena
        whereCondition.created_at = Object.assign(Object.assign({}, whereCondition.created_at), { [sequelize_1.Op.lte]: new Date(endDateStr) });
    }
    const loggedUser = yield models_1.User.findByPk(authorUid);
    let providerList;
    if ((loggedUser === null || loggedUser === void 0 ? void 0 : loggedUser.dataValues.role) === 'ADMIN') {
        //if loggedUser is admin, list all providers
        providerList = yield models_1.Provider.findAll({
            where: whereCondition, // Filtra por fechas si se pasaron
        });
    }
    else {
        //if loggedUser is not admin, list only providers created bi itself
        providerList = yield models_1.Provider.findAll({
            where: Object.assign({ operatorId: authorUid }, whereCondition),
        });
    }
    res.json({
        providerList
    });
});
exports.listProviders = listProviders;
const getProvider = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { authorUid } = req;
    const loggedUser = yield models_1.User.findByPk(authorUid);
    let provider;
    if ((loggedUser === null || loggedUser === void 0 ? void 0 : loggedUser.dataValues.role) === 'ADMIN') {
        provider = yield models_1.Provider.findOne({
            where: {
                id_provider: id
            }
        });
    }
    else {
        provider = yield models_1.Provider.findOne({
            where: {
                id_provider: id,
                operatorId: authorUid
            }
        });
    }
    if (provider) {
        res.json({
            provider
        });
    }
    else {
        res.status(404).json({
            msg: 'Proveedor no encontrado'
        });
    }
});
exports.getProvider = getProvider;
const createProvider = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body, authorUid } = req;
    try {
        // Obtener la fecha actual (inicio del día)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        // Contar los proveedores creados por el usuario en el día actual
        const providersToday = yield models_1.Provider.count({
            where: {
                operatorId: authorUid,
                created_at: {
                    [sequelize_1.Op.gte]: today, // Desde el inicio del día
                },
            },
        });
        // Validar si ha alcanzado el límite
        const MAX_PROVIDERS_PER_DAY = 20;
        if (providersToday >= MAX_PROVIDERS_PER_DAY) {
            return res.status(400).json({
                msg: `Solo puedes crear ${MAX_PROVIDERS_PER_DAY} proveedores por día.`,
            });
        }
        // Crear el proveedor si no ha alcanzado el límite
        const provider = new models_1.Provider(body);
        provider.operatorId = authorUid ? authorUid : 0;
        const newProvider = yield models_1.Provider.create(provider.dataValues);
        res.json({
            msg: "Se creó correctamente el proveedor.",
            provider: newProvider,
        });
    }
    catch (error) {
        res.status(500).json({
            msg: "Ocurrió un problema al realizar tu solicitud.",
            error,
        });
    }
});
exports.createProvider = createProvider;
const updateProvider = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { body, authorUid } = req;
    try {
        const loggedUser = yield models_1.User.findByPk(authorUid);
        let provider;
        if ((loggedUser === null || loggedUser === void 0 ? void 0 : loggedUser.dataValues.role) === 'ADMIN') {
            provider = yield models_1.Provider.findOne({
                where: {
                    id_provider: id
                }
            });
        }
        else {
            provider = yield models_1.Provider.findOne({
                where: {
                    id_provider: id,
                    operatorId: authorUid
                }
            });
        }
        if (!provider) {
            return res.status(404).json({
                msg: 'No existe un proveedor con el id ' + id
            });
        }
        yield provider.update(body);
        res.json({
            msg: "El proveedor se actualizo correctamente",
            provider
        });
    }
    catch (error) {
        res.status(500).json({
            msg: 'Ocurrio un problema al realizar tu solicitud',
            error
        });
    }
});
exports.updateProvider = updateProvider;
const deleteProvider = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { authorUid } = req;
    try {
        const loggedUser = yield models_1.User.findByPk(authorUid);
        let provider;
        if ((loggedUser === null || loggedUser === void 0 ? void 0 : loggedUser.dataValues.role) === 'ADMIN') {
            provider = yield models_1.Provider.findOne({
                where: {
                    id_provider: id
                }
            });
        }
        else {
            provider = yield models_1.Provider.findOne({
                where: {
                    id_provider: id,
                    operatorId: authorUid
                }
            });
        }
        if (!provider) {
            return res.status(404).json({
                msg: 'No existe un proveedor con el id' + id
            });
        }
        yield provider.destroy();
        res.json({
            msg: 'El proveedor ha sido eliminado correctamente'
        });
    }
    catch (error) {
        res.status(500).json({
            msg: 'Ocurrio un problema al realizar tu solicitud',
            error
        });
    }
});
exports.deleteProvider = deleteProvider;
const listProviderFields = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const providers = yield models_1.Provider.findAll({
            attributes: ["commercialName", "businessName", "rfc"]
        });
        res.json({
            providers
        });
    }
    catch (error) {
        res.status(500).json({
            msg: "Ocurrió un problema al realizar tu solicitud",
            error
        });
    }
});
exports.listProviderFields = listProviderFields;
const checkProviderExists = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { field, value, excludeId } = req.body;
    // Verifica si el campo y el valor fueron enviados
    if (!field || !value) {
        return res.status(400).json({
            msg: "Se requiere un campo y un valor para realizar la búsqueda"
        });
    }
    // Define los campos válidos
    const validFields = ["commercialName", "businessName", "rfc"];
    if (!validFields.includes(field)) {
        return res.status(400).json({
            msg: `El campo ${field} no es válido. Los campos válidos son: ${validFields.join(", ")}`
        });
    }
    // Construye la condición de búsqueda
    const condition = { [field]: value };
    // Si se incluye excludeId, agrega la exclusión del ID a la condición
    if (excludeId) {
        condition.id = { $ne: excludeId }; // Excluye el registro con este ID
    }
    try {
        // Busca si existe un proveedor con la condición
        const provider = yield models_1.Provider.findOne({ where: condition });
        if (provider) {
            res.json({
                exists: true,
                msg: `El proveedor con ${field}: '${value}' ya existe.`
            });
        }
        else {
            res.json({
                exists: false,
                msg: `No se encontró un proveedor con ${field}: '${value}'.`
            });
        }
    }
    catch (error) {
        res.status(500).json({
            msg: "Ocurrió un problema al realizar tu solicitud",
            error
        });
    }
});
exports.checkProviderExists = checkProviderExists;
const exportProvidersToExcel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Obtener la lista de proveedores
        const providers = yield models_1.Provider.findAll({
            include: [
                {
                    model: models_1.User,
                    as: "operator",
                    attributes: ["username"],
                },
            ],
        });
        // Crear un nuevo libro de Excel
        const workbook = new exceljs_1.default.Workbook();
        const worksheet = workbook.addWorksheet("Proveedores");
        // Agregar encabezados
        worksheet.columns = [
            { header: "ID", key: "id_provider", width: 10 },
            { header: "Nombre Comercial", key: "commercialName", width: 30 },
            { header: "Razón Social", key: "businessName", width: 30 },
            { header: "RFC", key: "rfc", width: 20 },
            { header: "Teléfono", key: "phone", width: 20 },
            { header: "Domicilio", key: "address", width: 20 },
            { header: "Vendedor", key: "seller", width: 30 },
            { header: "Operador", key: "operator", width: 30 },
            { header: "Fecha de Creación", key: "created_at", width: 20 },
        ];
        // Agregar datos de los proveedores
        providers.forEach((provider) => {
            var _a;
            worksheet.addRow({
                id_provider: provider.id_provider,
                commercialName: provider.commercialName,
                businessName: provider.businessName,
                rfc: provider.rfc,
                phone: provider.phone,
                address: provider.address,
                seller: provider.sellerFullName,
                operator: ((_a = provider.operator) === null || _a === void 0 ? void 0 : _a.username) || "N/A",
                created_at: provider.created_at,
            });
        });
        // Estilo opcional para el encabezado
        worksheet.getRow(1).font = { bold: true };
        // Configurar la respuesta HTTP para enviar el archivo Excel
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", "attachment; filename=Proveedores.xlsx");
        // Enviar el archivo
        yield workbook.xlsx.write(res);
        res.status(200).end();
    }
    catch (error) {
        console.error("Error al generar el archivo Excel:", error);
        res.status(500).json({
            msg: "Ocurrió un error al generar el archivo Excel.",
            error,
        });
    }
});
exports.exportProvidersToExcel = exportProvidersToExcel;
