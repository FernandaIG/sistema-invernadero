import routerx from 'express-promise-router';
import articuloController from '../controllers/ArticuloController';
import auth from '../middleware/auth';
import upload from '../middleware/upload';

const router= routerx();

router.post('/add',auth.verifyVendedor,articuloController.add);
router.post('/upload',upload,articuloController.upload);
router.get('/getImage',articuloController.getImage);
router.get('/query',articuloController.query);
router.get('/queryCodigo',articuloController.queryCodigo);
router.get('/list',articuloController.list);
router.get('/listsinCategoria',articuloController.listsinCategoria);
router.get('/listCategoria',articuloController.listCategoria);
router.get('/listCalificacion',articuloController.listPorCalificacion);
router.put('/update',auth.verifyVendedor,articuloController.update);
router.delete('/remove',auth.verifyVendedor,articuloController.remove);
router.put('/activate',auth.verifyVendedor,articuloController.activate);
router.put('/deactivate',auth.verifyVendedor,articuloController.deactivate);

export default router;