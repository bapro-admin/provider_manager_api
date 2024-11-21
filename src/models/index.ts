import Provider from "./provider.model";
import User from "./user.model";

// Definir relaciones
Provider.belongsTo(User, { foreignKey: "operatorId", as: "operator" });
User.hasMany(Provider, { foreignKey: "operatorId", as: "providers" });

export { Provider, User };
