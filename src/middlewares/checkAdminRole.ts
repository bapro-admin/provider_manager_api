import { Request, Response, NextFunction } from 'express';
import User from '../models/user.model'; // Ajusta el path según donde tengas el modelo

export const checkAdminRole = async (req: Request, res: Response, next: NextFunction) => {
    const { authorUid } = req;

    try {
        const loggedUser = await User.findByPk(authorUid);

        if (loggedUser?.dataValues.role === 'ADMIN') {
            next(); // Permite la continuación al siguiente middleware o controlador
        } else {
            res.status(403).json({
                msg: 'El usuario que intenta hacer esta acción no cuenta con suficientes privilegios'
            });
        }
    } catch (error) {
        res.status(500).json({
            msg: 'Error de servidor',
            error
        });
    }
};
