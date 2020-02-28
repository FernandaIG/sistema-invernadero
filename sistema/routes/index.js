import routerx from 'express-promise-router';
import categoriaRouter from './categoria';
import articuloRouter from './articulo';
import usuarioRouter from './usuario';
import personaRouter from './persona';
import ingresoRouter from './ingreso';
import ventaRouter from './venta';
import cuentaRouter from './cuenta';
import entradaRouter from './entrada';
import salidaRouter from './salida';
import Apartado from './apartado';
import Presupuesto from './presupuesto';
import Carrito from './carrito';
import Lista from './lista';
import Venta_en_linea from './venta_en_linea';
import configuracion from './configuracion';
import Calificar from './calificar';
import Merma from './merma';

const router = routerx();

// La variable router cuando haga refrerencia al primer parametro(categoria,articulo...)
//usara las rutas del segundo parametro
router.use('/categoria', categoriaRouter);
router.use('/articulo', articuloRouter);
router.use('/usuario', usuarioRouter);
router.use('/persona', personaRouter);
router.use('/ingreso', ingresoRouter);
router.use('/venta', ventaRouter);
router.use('/cuenta', cuentaRouter);
router.use('/entrada', entradaRouter);
router.use('/salida', salidaRouter);
router.use('/apartado', Apartado);
router.use('/presupuesto', Presupuesto);
router.use('/carrito', Carrito);
router.use('/lista', Lista);
router.use('/venta_en_linea', Venta_en_linea);
router.use('/configuracion', configuracion);
router.use('/calificar', Calificar);
router.use('/merma', Merma);
export default router;