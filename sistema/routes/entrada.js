import routerx from 'express-promise-router';
import entradaController from '../controllers/EntradaController';
import auth from '../middleware/auth';

const router= routerx();

router.post('/add',auth.veryfyAdministrador,entradaController.add);
router.get('/query',auth.veryfyAdministrador,entradaController.query);
router.get('/list',auth.veryfyAdministrador,entradaController.list);
//router.get('/grafico12meses',auth.veryfyAdministrador,entradaController.grafico12Meses);
router.put('/update',auth.veryfyAdministrador,entradaController.update);
// router.delete('/remove',auth.verifyVendedor,entradaController.remove);
router.put('/activate',auth.veryfyAdministrador,entradaController.activate);
router.put('/deactivate',auth.veryfyAdministrador,entradaController.deactivate);

export default router;