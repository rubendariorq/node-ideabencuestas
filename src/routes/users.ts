import { Router } from 'express';
import { usersController } from '../controllers/UsersController';
import passport from 'passport';
import helper from '../lib/helpers';

const router:Router = Router();

router.get('/forgot', usersController.renderForgot);
router.get('/login', usersController.renderLogin);
router.get('/logout', usersController.logout);
router.get('/mydata', helper.isAuthenticated, usersController.renderMyData);
router.post('/forgot', usersController.forgot);
router.post('/login', passport.authenticate('local', {
    successRedirect: '/surveys/all',
    failureRedirect: '/users/login',
    failureFlash: true
}));
router.post('/mydata', usersController.updateMyData);

export default router;