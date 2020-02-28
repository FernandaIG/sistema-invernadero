import routerx from 'express-promise-router';
import apartadoController from '../controllers/ApartadoController';
import auth from '../middleware/auth';

const router = routerx();

router.post('/add', auth.verifyVendedor, apartadoController.add);
router.get('/query', auth.verifyVendedor, apartadoController.query);
router.get('/list', auth.verifyVendedor, apartadoController.list);
router.put('/update', auth.verifyVendedor, apartadoController.update);
router.delete('/remove', auth.verifyVendedor, apartadoController.remove);
router.put('/activate', auth.verifyVendedor, apartadoController.activate);
router.put('/deactivate', auth.verifyVendedor, apartadoController.deactivate);

export default router;