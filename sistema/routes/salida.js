import routerx from 'express-promise-router';
import salidaController from '../controllers/SalidaController';
import auth from '../middleware/auth';

const router= routerx();

router.post('/add',auth.veryfyAdministrador,salidaController.add);
router.get('/query',auth.veryfyAdministrador,salidaController.query);
router.get('/list',auth.veryfyAdministrador,salidaController.list);
//router.get('/grafico12meses',auth.veryfyAdministrador,salidaController.grafico12Meses);
router.put('/update',auth.veryfyAdministrador,salidaController.update);
// router.delete('/remove',auth.verifyVendedor,salidaController.remove);
router.put('/activate',auth.veryfyAdministrador,salidaController.activate);
router.put('/deactivate',auth.veryfyAdministrador,salidaController.deactivate);

export default router;