import routerx from 'express-promise-router';
import carritoController from '../controllers/CarritoController';
import auth from '../middleware/auth';

const router= routerx();

router.post('/add',carritoController.add);
router.get('/query',carritoController.query);
router.get('/list',carritoController.list);
//router.get('/grafico12meses',carritoController.grafico12Meses);
router.put('/update',carritoController.update);
router.put('/updatedetalles',carritoController.updateDetalles);
router.put('/updatetotal',carritoController.updateTotal);
router.put('/updacantidad',carritoController.updateCantidad);
router.delete('/remove',carritoController.remove);
router.put('/activate',carritoController.activate);
router.put('/deactivate',carritoController.deactivate);

export default router;