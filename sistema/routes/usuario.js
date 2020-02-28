import routerx from 'express-promise-router';
import usuarioController from '../controllers/UsuarioController';
import auth from '../middleware/auth';


const router = routerx();

router.post('/add', auth.veryfyAdministrador, usuarioController.add);
router.post('/addCliente', usuarioController.add);
router.get('/query', auth.veryfyAdministrador, usuarioController.query);
router.get('/queryCliente', usuarioController.query);
router.get('/list', auth.veryfyAdministrador, usuarioController.list);
router.put('/update', auth.veryfyAdministrador, usuarioController.update);
router.put('/updateCliente', usuarioController.update);
router.delete('/remove', auth.veryfyAdministrador, usuarioController.remove);
router.put('/activate', auth.veryfyAdministrador, usuarioController.activate);
router.put('/deactivate', auth.veryfyAdministrador, usuarioController.deactivate);
router.put('/recuperacion', usuarioController.recuperacionPass);

router.post('/login', usuarioController.login);

export default router;