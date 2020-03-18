import mongoose from 'mongoose';

export interface User extends mongoose.Document{
    email: String;
    name: String;
    password: String;
}