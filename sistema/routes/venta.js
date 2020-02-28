import routerx from 'express-promise-router';
import ventaController from '../controllers/VentaController';
import auth from '../middleware/auth';

const router = routerx();

router.post('/add', auth.verifyVendedor, ventaController.add);
router.get('/query', auth.verifyVendedor, ventaController.query);
router.get('/list', auth.verifyVendedor, ventaController.list);
//rutas para gráficos para ventas totales
router.get('/grafico12meses', auth.verifyUsuario, ventaController.grafico12Meses);
router.get('/graficomes', auth.verifyUsuario, ventaController.graficoPorMes);
router.get('/graficodia', auth.verifyUsuario, ventaController.graficoPorDia);
//rutas para gráfico ticket promedio
router.get('/graficoticket', auth.verifyUsuario, ventaController.graficoTicket);
router.get('/graficoticketmes', auth.verifyUsuario, ventaController.graficoTicketMes);
router.get('/graficoticketdia', auth.verifyUsuario, ventaController.graficoTicketDia);
//rutas gráficos producto mas vendido
router.get('/graficoproducto', auth.verifyUsuario, ventaController.graficoProducto);
router.get('/graficoproductomes', auth.verifyUsuario, ventaController.graficoProductoMes);
router.get('/graficoproductodia', auth.verifyUsuario, ventaController.graficoProductoDia);
//rutas para gráficos mejor vendedor
router.get('/graficovendedor', auth.verifyUsuario, ventaController.graficoMejorVendedor);
router.get('/graficovendedormes', auth.verifyUsuario, ventaController.graficoMejorVendedorMes);
router.get('/graficovendedordia', auth.verifyUsuario, ventaController.graficoMejorVendedorDia);

router.put('/activate', auth.verifyVendedor, ventaController.activate);
router.put('/deactivate', auth.verifyVendedor, ventaController.deactivate);

export default router;