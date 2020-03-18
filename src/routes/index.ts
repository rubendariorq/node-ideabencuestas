import { Router } from 'express';
import { indexController } from '../controllers/IndexController';

const router:Router = Router();

router.get('/', indexController.index);

export default router;