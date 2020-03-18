import UserModel from '../UserModel';
import { User } from '../../interfaces/user.interface';
import { UserDto } from '../dto/UserDto';

export class UserDao{

    constructor(){}

    public async findAllUsers():Promise<User[]> {
        const userData = await UserModel.find();
        return userData;
    }

    public async findUser(user:UserDto):Promise<User|null> {
        const userData = await UserModel.findOne({email: user.getEmail()});
        return userData;
    }

    public async updateUser(userVerify:UserDto, user:UserDto):Promise<User|null> {
        const userData = await UserModel.findOneAndUpdate({email: userVerify.getEmail()}, {
            email: user.getEmail(),
            name: user.getName(),
            password: user.getPassword()
        });
        return userData;
    }
}
