import { Router } from "express";
import { listProviders, getProvider, createProvider, updateProvider, deleteProvider, listProviderFields, checkProviderExists, exportProvidersToExcel} from '../controllers/provider.controller'
import { validarJWT } from "../middlewares/valida-jwt";
import { checkAdminRole } from "../middlewares/checkAdminRole";

const router = Router();

router.get('/', [
        validarJWT as any
    ], 
    listProviders)
router.get('/storedProviders', [
        validarJWT as any
    ], 
    listProviderFields)
router.post('/check-existence', [
        validarJWT as any
    ], 
    checkProviderExists as any)
router.get('/:id', [
        validarJWT as any
    ], 
    getProvider)
router.post('/', [
        validarJWT as any
    ],
    createProvider as any)
router.put('/:id',[
        validarJWT as any
    ], 
    updateProvider as any)
router.delete('/:id',[
        validarJWT as any
    ], 
    deleteProvider as any)
router.post('/export',[
        validarJWT as any,
        checkAdminRole,
    ], 
    exportProvidersToExcel as any)

export default router;
