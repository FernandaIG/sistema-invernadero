import routerx from 'express-promise-router';
import ConfiguracionController from '../controllers/ConfiguracionController';
import auth from '../middleware/auth';

const router = routerx();

router.post('/add',ConfiguracionController.add);
router.put('/update', auth.veryfyAdministrador, ConfiguracionController.update);
router.get('/list', ConfiguracionController.list);
export default router;