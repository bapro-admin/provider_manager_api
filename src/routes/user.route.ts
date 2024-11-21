import { Router } from "express";
import { createUser, deleteUser, getUser, getUsers, updateUser } from "../controllers/user.controller";
import { validarJWT } from "../middlewares/valida-jwt";
import { checkAdminRole } from "../middlewares/checkAdminRole";

const router = Router();

router.get('/',[
    validarJWT as any,
    checkAdminRole,
],getUsers)
router.get('/:id',[
    validarJWT as any,
    checkAdminRole,
], getUser)
router.post('/',[
    validarJWT as any,
    checkAdminRole
], createUser as any)
router.put('/:id',[
    validarJWT as any,
    checkAdminRole
], updateUser as any)
router.delete('/:id',[
    validarJWT as any,
    checkAdminRole
], deleteUser as any)

export default router;