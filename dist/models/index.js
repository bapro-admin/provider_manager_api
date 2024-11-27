"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.Provider = void 0;
const provider_model_1 = __importDefault(require("./provider.model"));
exports.Provider = provider_model_1.default;
const user_model_1 = __importDefault(require("./user.model"));
exports.User = user_model_1.default;
// Definir relaciones
provider_model_1.default.belongsTo(user_model_1.default, { foreignKey: "operatorId", as: "operator" });
user_model_1.default.hasMany(provider_model_1.default, { foreignKey: "operatorId", as: "providers" });
