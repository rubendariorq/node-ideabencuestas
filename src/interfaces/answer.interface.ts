import mongoose from 'mongoose';

export interface Answer extends mongoose.Document{
    id: String;
    idSurvey: String;
    answers: Object[];
}