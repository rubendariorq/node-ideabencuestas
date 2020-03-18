import mongoose from 'mongoose';

export interface Question extends mongoose.Document{
    idSurvey: String;
    questiontype: String;
    question: String;
    order: String;
    options: Object[];
    isOther: String;
}