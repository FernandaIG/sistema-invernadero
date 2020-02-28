import routerx from 'express-promise-router';
import venta_en_lineaController from '../controllers/venta_en_lineaController';
import auth from '../middleware/auth';

const router= routerx();

router.get('/query',venta_en_lineaController.query);
router.get('/list',venta_en_lineaController.list);
router.post('/checkout',venta_en_lineaController.checkout);
router.post('/checkoutproducto',venta_en_lineaController.checkoutProducto);
router.get('/grafico12meses',auth.verifyVendedor,venta_en_lineaController.grafico12Meses);
router.put('/updatedatosenvio',venta_en_lineaController.updateDatosEnvio);
 router.delete('/remove',auth.veryfyAdministrador,venta_en_lineaController.remove);
router.put('/activate',auth.verifyVendedor,venta_en_lineaController.activate);
router.put('/deactivate',auth.verifyVendedor,venta_en_lineaController.deactivate);
router.put('/modificarnumguia',auth.verifyVendedor,venta_en_lineaController.modificarGuia);
router.post('/send', auth.verifyVendedor, venta_en_lineaController.correoSend);
router.put('/update', auth.verifyVendedor, venta_en_lineaController.update);

export default router;