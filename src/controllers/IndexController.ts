import {Request, Response} from 'express';

class IndexController{
    
    public index(req:Request, res:Response):void {
        res.redirect('/users/login');
    };
}

export const indexController = new IndexController();
