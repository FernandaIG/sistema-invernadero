import routerx from 'express-promise-router';
import mermaController from '../controllers/MermaController';
import auth from '../middleware/auth';

const router = routerx();

router.post('/add', auth.verifyVendedor, mermaController.add);
router.get('/query', auth.verifyVendedor, mermaController.query);
router.get('/list', auth.verifyVendedor, mermaController.list);
router.put('/activate', auth.verifyVendedor, mermaController.activate);
router.put('/deactivate', auth.verifyVendedor, mermaController.deactivate);

export default router;