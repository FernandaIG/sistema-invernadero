import routerx from 'express-promise-router';
import presupuestoController from '../controllers/PresupuestoController';
import auth from '../middleware/auth';

const router = routerx();

router.post('/add', auth.verifyVendedor, presupuestoController.add);
router.get('/query', auth.verifyVendedor, presupuestoController.query);
router.get('/list', auth.verifyVendedor, presupuestoController.list);
router.delete('/remove', auth.verifyVendedor, presupuestoController.remove);
router.post('/send', auth.verifyVendedor, presupuestoController.sendEmail);
//Ruta para crear el pdf
router.post('/pdf', auth.verifyVendedor, presupuestoController.pdf);
//Ruta para enviar el pdf al client-side
router.get('/sendpdf', auth.verifyVendedor, presupuestoController.sendPdf);
router.put('/activate', auth.verifyVendedor, presupuestoController.activate);
router.put('/deactivate', auth.verifyVendedor, presupuestoController.deactivate);

export default router;