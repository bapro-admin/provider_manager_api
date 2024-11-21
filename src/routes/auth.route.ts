import { Router } from "express";
import { check } from "express-validator";
import { doLogin, register } from "../controllers/auth.controller";
import  { validarCampos } from "../middlewares/validarCampos";

const router = Router();

router.post('/login', [
    check('username', 'El correo es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos as any
], doLogin as any);

router.post('/register', register as any);

export default router;
