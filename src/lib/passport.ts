import passport from 'passport';
import passportLocal from 'passport-local';
import UserModel from '../models/UserModel';
import { User } from '../interfaces/user.interface';

const LocalStrategy = passportLocal.Strategy;

passport.use(new LocalStrategy({
    usernameField: 'email'
}, async (email, password, done) => {
    const user = await UserModel.findOne({email: email});
    if(!user){
        return done(null, false, {message: 'Usuario no encontrado'});
    }else{
        if(password == user.password){
            return done(null, user);
        }else{
            return done(null, false, {message: 'Contraseña incorrecta'});
        }
    }
}));

passport.serializeUser((user:User, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    UserModel.findById(id, (err, user) => {
        done(err, user);
    })
});

