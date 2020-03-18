import { Request, Response } from 'express';
import { UserDao } from '../models/dao/UserDao';
import { UserDto } from '../models/dto/UserDto';
import { User } from '../interfaces/user.interface';
import nodemailer from 'nodemailer';
import { mail } from '../keys';

class UsersController {

    public logout(req: Request, res: Response): void {
        req.logout();
        res.redirect('/users/login');
    }

    public async forgot(req: Request, res: Response): Promise<void> {
        const { email } = req.body;

        const userDto = new UserDto();
        userDto.setEmail(email);
        const userDao = new UserDao();
        const user = await userDao.findUser(userDto);

        if (user) {
            const userEmail = user['email'];
            const userPassword = user['password'];
            //Contenido del mensaje
            const contentHTML = `
            Proceso de recuperación de su cuenta
            
            Los siguientes datos son sus credenciales para iniciar sesión en el portal
            Correo: ${userEmail}
            Contraseña: ${userPassword}
            `;

            const transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                    user: mail.EMAIL,
                    pass: mail.EMAILPASSWORD
                }
            });

            const info = await transporter.sendMail({
                from: mail.EMAIL,
                to: email,
                subject: 'Recuperar contraseña',
                text: contentHTML
            })
                .then(() => {
                    req.flash('success_msg', 'Su contraseña fue enviada al correo');
                    res.redirect('/users/login');
                })
                .catch(() => {
                    req.flash('error_msg', 'Verifique que el correo este bien escrito');
                    res.redirect('/users/forgot');
                })
        } else {
            req.flash('error_msg', 'El correo ingresado no se encuentra registrado');
            res.redirect('/users/forgot');
        }
    }

    public async updateMyData(req: Request, res: Response): Promise<void> {
        const { email, emailVerify, name, password, passwordVerify } = req.body;

        if (!email || !name || !password || !passwordVerify) {
            req.flash('error_msg', 'Debe diligenciar todos los campos del formulario');
        } else {
            const user = new UserDto();
            user.setEmail(emailVerify);

            const userDao = new UserDao();
            let userData = await userDao.findUser(user);

            if (userData != null) {
                if (password == passwordVerify) {
                    const userVerify = new UserDto();
                    userVerify.setEmail(emailVerify);

                    user.setEmail(email);
                    user.setName(name);
                    user.setPassword(password);

                    userData = await userDao.updateUser(userVerify, user);

                    if (userData != null) {
                        req.flash('success_msg', 'Cambios guardados')
                    } else {
                        req.flash('error_msg', 'A ocurrido un error al intentar guardar los datos');
                    }
                } else {
                    req.flash('error_msg', 'Las contraseñas no coinciden');
                }
            } else {
                req.flash('error_msg', 'El usuario no existe');
            }
        }

        res.redirect('/users/mydata');
    }

    public renderForgot(req: Request, res: Response): void {
        res.render('users/forgot')
    }

    public renderLogin(req: Request, res: Response): void {
        res.render('users/login');
    }

    public async renderMyData(req: Request, res: Response): Promise<void> {
        const userDao: UserDao = new UserDao();
        const userData: User[] = await userDao.findAllUsers();
        res.render('users/mydata', userData[0]);
    }
}

export const usersController = new UsersController();
