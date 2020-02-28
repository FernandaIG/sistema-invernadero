import routerx from 'express-promise-router';
import categoriaController from '../controllers/CategoriaController';
import auth from '../middleware/auth';

const router= routerx();

router.post('/add',auth.verifyVendedor,categoriaController.add);
router.get('/query',auth.verifyVendedor,categoriaController.query);
router.get('/list',categoriaController.list);
router.get('/listporNombre',categoriaController.listporNombre);
router.put('/update',auth.verifyVendedor,categoriaController.update);
router.delete('/remove',auth.verifyVendedor,categoriaController.remove);
router.put('/activate',auth.verifyVendedor,categoriaController.activate);
router.put('/deactivate',auth.verifyVendedor,categoriaController.deactivate);

export default router;