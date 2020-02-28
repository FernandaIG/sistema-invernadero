import routerx from 'express-promise-router';
import cuentaController from '../controllers/CuentaController';
import auth from '../middleware/auth';

const router= routerx();

router.post('/add',auth.veryfyAdministrador,cuentaController.add);
router.get('/query',auth.veryfyAdministrador,cuentaController.query);
router.get('/list',auth.veryfyAdministrador,cuentaController.list);
router.put('/update',auth.veryfyAdministrador,cuentaController.update);
router.delete('/remove',auth.veryfyAdministrador,cuentaController.remove);
router.put('/activate',auth.veryfyAdministrador,cuentaController.activate);
router.put('/deactivate',auth.veryfyAdministrador,cuentaController.deactivate);

export default router;