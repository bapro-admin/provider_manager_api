import { Request, Response } from "express"
import { Provider, User } from "../models";
import { Op } from 'sequelize';
import ExcelJS from "exceljs";
import * as dotenv from "dotenv";



export const listProviders = async (req: Request, res: Response) => {
    const { authorUid } = req;
    const { startDate, endDate } = req.query; // Fechas pasadas como query params

    // Convierte las fechas a objetos Date si se pasaron en la solicitud
    let whereCondition: any = {};

    if (startDate) {
        const startDateStr = String(startDate);  // Asegura que es una cadena
        whereCondition.created_at = {
            [Op.gte]: new Date(startDateStr), // Fecha de inicio (mayor o igual)
        };
    }
    
    if (endDate) {
        const endDateStr = String(endDate);  // Asegura que es una cadena
        whereCondition.created_at = {
            ...whereCondition.created_at, // Mantiene la condición previa si existe
            [Op.lte]: new Date(endDateStr), // Fecha de fin (menor o igual)
        }
    }

    const loggedUser = await User.findByPk(authorUid);
    let providerList: Provider[]

    if (loggedUser?.dataValues.role === 'ADMIN') {
        //if loggedUser is admin, list all providers
         providerList = await Provider.findAll({
            where: whereCondition, // Filtra por fechas si se pasaron
        });
    } else { 
        //if loggedUser is not admin, list only providers created bi itself
        providerList = await Provider.findAll({
            where: {
                operatorId: authorUid,
                ...whereCondition, // Filtra por fechas si se pasaron
            },
        });
    }

    res.json({
        providerList
    })

}

export const getProvider = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { authorUid } = req;

    const loggedUser = await User.findByPk(authorUid);
    let provider: Provider | null
    if (loggedUser?.dataValues.role === 'ADMIN') {
        provider = await Provider.findOne({
            where:{
                id_provider: id
            }
        });
    }else{
        provider = await Provider.findOne({
            where:{
                id_provider: id,
                operatorId: authorUid
            }
        });
    }
    
    if(provider){
        res.json({
            provider
        })
    }else{
        res.status(404).json({
            msg: 'Proveedor no encontrado'
        })
    }
}

export const createProvider = async (req: Request, res: Response) => {
    const { body, authorUid } = req;
    process.env.MAX_PROVIDERS as unknown as boolean
    const max_providers_feature = process.env.MAX_PROVIDERS || true;
    try {
        // Obtener la fecha actual (inicio del día)
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Contar los proveedores creados por el usuario en el día actual
        const providersToday = await Provider.count({
            where: {
                operatorId: authorUid,
                created_at: {
                    [Op.gte]: today, // Desde el inicio del día
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
        const provider = new Provider(body);
        provider.operatorId = authorUid ? authorUid : 0;
        const newProvider = await Provider.create(provider.dataValues);

        res.json({
            msg: "Se creó correctamente el proveedor.",
            provider: newProvider,
        });
    } catch (error) {
        res.status(500).json({
            msg: "Ocurrió un problema al realizar tu solicitud.",
            error,
        });
    }
};

export const updateProvider = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { body, authorUid } = req;
    try {
        const loggedUser = await User.findByPk(authorUid);
        let provider: Provider | null
        if (loggedUser?.dataValues.role === 'ADMIN') {
            provider = await Provider.findOne({
                where:{
                    id_provider: id
                }
            });
        }else{
            provider = await Provider.findOne({
                where:{
                    id_provider: id,
                    operatorId: authorUid
                }
            });
        }
        if(!provider){
            return res.status(404).json({
                msg: 'No existe un proveedor con el id ' + id
            })
        }
        
        await provider.update(body);
        res.json({
            msg: "El proveedor se actualizo correctamente",
            provider
        })

    } catch (error) {
        res.status(500).json({
            msg: 'Ocurrio un problema al realizar tu solicitud',
            error
        })
    }

}

export const deleteProvider = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { authorUid } = req;
    try {
        const loggedUser = await User.findByPk(authorUid);
        let provider: Provider | null
        if (loggedUser?.dataValues.role === 'ADMIN') {
            provider = await Provider.findOne({
                where:{
                    id_provider: id
                }
            });
        }else{
            provider = await Provider.findOne({
                where:{
                    id_provider: id,
                    operatorId: authorUid
                }
            });
        }
        if(!provider){
            return res.status(404).json({
                msg: 'No existe un proveedor con el id' + id
            })
        }
        await provider.destroy();
        res.json({
            msg: 'El proveedor ha sido eliminado correctamente'
        })  
          
    } catch (error) {
        res.status(500).json({
            msg: 'Ocurrio un problema al realizar tu solicitud',
            error
        })
    }   
}
export const listProviderFields = async (req: Request, res: Response) => {
    try {
        const providers = await Provider.findAll({
            attributes: ["commercialName", "businessName", "rfc"]
        });

        res.json({
            providers
        });
    } catch (error) {
        res.status(500).json({
            msg: "Ocurrió un problema al realizar tu solicitud",
            error
        });
    }
};

export const checkProviderExists = async (req: Request, res: Response) => {
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
    const condition: any = { [field]: value };

    // Si se incluye excludeId, agrega la exclusión del ID a la condición
    if (excludeId) {
        condition.id = { $ne: excludeId }; // Excluye el registro con este ID
    }

    try {
        // Busca si existe un proveedor con la condición
        const provider = await Provider.findOne({ where: condition });
        if (provider) {
            res.json({
                exists: true,
                msg: `El proveedor con ${field}: '${value}' ya existe.`
            });
        } else {
            res.json({
                exists: false,
                msg: `No se encontró un proveedor con ${field}: '${value}'.`
            });
        }
    } catch (error) {
        res.status(500).json({
            msg: "Ocurrió un problema al realizar tu solicitud",
            error
        });
    }
};


export const exportProvidersToExcel = async (req: Request, res: Response) => {
    try {
        // Obtener la lista de proveedores
        const providers = await Provider.findAll({
            include: [
                {
                    model: User,
                    as: "operator",
                    attributes: ["username"],
                },
            ],
        });

        // Crear un nuevo libro de Excel
        const workbook = new ExcelJS.Workbook();
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
            worksheet.addRow({
                id_provider: provider.id_provider,
                commercialName: provider.commercialName,
                businessName: provider.businessName,
                rfc: provider.rfc,
                phone: provider.phone,
                address: provider.address,
                seller: provider.sellerFullName,
                operator: provider.operator?.username || "N/A",
                created_at: provider.created_at,
            });
        });

        // Estilo opcional para el encabezado
        worksheet.getRow(1).font = { bold: true };

        // Configurar la respuesta HTTP para enviar el archivo Excel
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=Proveedores.xlsx"
        );

        // Enviar el archivo
        await workbook.xlsx.write(res);
        res.status(200).end();
    } catch (error) {
        console.error("Error al generar el archivo Excel:", error);
        res.status(500).json({
            msg: "Ocurrió un error al generar el archivo Excel.",
            error,
        });
    }
};