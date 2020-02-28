import routerx from 'express-promise-router';
import listaController from '../controllers/ListaController';
import auth from '../middleware/auth';

const router= routerx();

router.post('/add',listaController.add);
router.get('/query',listaController.query);
router.get('/list',listaController.list);
//router.get('/grafico12meses',listaController.grafico12Meses);
router.put('/update',listaController.update);
router.put('/updatedetalles',listaController.updateDetalles);
router.put('/updacantidad',listaController.updateCantidad);
// router.delete('/remove',auth.verifyVendedor,listaController.remove);
router.put('/activate',listaController.activate);
router.put('/deactivate',listaController.deactivate);

export default router;