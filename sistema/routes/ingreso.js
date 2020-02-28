import routerx from 'express-promise-router';
import ingresoController from '../controllers/IngresoController';
import auth from '../middleware/auth';

const router= routerx();

router.post('/add',auth.verifyVendedor,ingresoController.add);
router.get('/query',auth.verifyVendedor,ingresoController.query);
router.get('/list',auth.verifyVendedor,ingresoController.list);
router.get('/grafico12meses',auth.verifyUsuario,ingresoController.grafico12Meses);
// router.put('/update',auth.verifyAlmacenero,ingresoController.update);
// router.delete('/remove',auth.verifyAlmacenero,ingresoController.remove);
router.put('/activate',auth.verifyVendedor,ingresoController.activate);
router.put('/deactivate',auth.verifyVendedor,ingresoController.deactivate);

export default router;