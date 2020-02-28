import routerx from 'express-promise-router';
import calificarController from '../controllers/CalificarController';
import auth from '../middleware/auth';

const router= routerx();

router.post('/add',calificarController.add);
router.get('/query',calificarController.query);
router.get('/list',calificarController.list);
router.put('/addcomment',calificarController.addComment);
router.put('/addlike',calificarController.addLike);
router.put('/deletecomment',calificarController.deleteComment);
router.put('/deletelike',calificarController.deleteLike);
router.put('/updatecomment',calificarController.updateComment);
// router.delete('/remove',auth.verifyVendedor,calificarController.remove);
router.put('/activate',calificarController.activate);
router.put('/deactivate',calificarController.deactivate);

export default router;