import mongoose from 'mongoose';

export interface Survey extends mongoose.Document{
    title: String;
    introduction: String;
    timeEstimated: String;
    securityCode: String;
    initDate: String;
    endDate: String;
    state: String;
    answerCount: Number;
}