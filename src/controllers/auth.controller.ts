import { Request, Response } from "express";
import  bcryptjs from "bcryptjs";
import { User } from "../models";

import { generarJWT } from "../helpers/generar-jwt";

export const doLogin = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    try {

        //verify if email exist
        const user = await User.findOne({
            where: {
                username: username
            }
        });

        if(!user){
            return res.status(400).json({
                msg: "Usuario no encontrado en la base de datos"
            })
        }

        //verify password
        const validPassword = bcryptjs.compareSync(password, user.password)

        if(!validPassword){
            return res.status(400).json({
                msg: "Usuario o contraseña no son correctos"
            })
        }

        //generate JWT
        const token = await generarJWT(user.id_user);
     
        res.json({
            msg: 'LOGIN OK',
            user,
            token
        })
        
    } catch (error) {
        console.log('OCURRIO UN ERROR', error)
        return res.status(500).json({
            msg: "No se pudo realizar tu solicitud"
        })
    }
}

export const register = async (req: Request, res: Response) => {
    const { 
        username,
        password, 
        role,
    } = req.body;
    const status = true;
    const newUser = User.build({ 
        username,
        role,
        password,
     })
    try {

        //validamos si el usuario que quieres registrar ya existe
        const existEmail = await User.findOne({
            where: {
                username: username
            }
        })

        if(existEmail){
            return res.status(400).json({
                msg: 'El usuario que deseas registrar ya existe'
            })
        }
        
        //encriptar contraseña
        const salt = bcryptjs.genSaltSync();
        newUser.password = bcryptjs.hashSync(newUser.password, salt)
        await newUser.save();

        res.json({
            msg: 'Usuario registrado correctamente',
            user: newUser
        })
        
    } catch (error) {
        res.status(500).json({
            msg: 'Ocurrio un problema al realizar tu solicitud',
            error
        })
    }
}