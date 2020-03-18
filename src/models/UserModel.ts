import mongoose, { Schema } from 'mongoose';
import { User } from '../interfaces/user.interface';

const UserSchema = new Schema({
    email: String,
    name: String,
    password: String
});

const userModel = mongoose.model<User>('User', UserSchema);

export default userModel;
