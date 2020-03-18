import mongoose, { Schema } from 'mongoose';
import { Survey } from '../interfaces/survey.interface';

const SurveySchema = new Schema({
    title: String,
    introduction: String,
    timeEstimated: String,
    securityCode: String,
    initDate: String,
    endDate: String,
    state: String,
    answerCount: Number
});

const surveyModel = mongoose.model<Survey>('Survey', SurveySchema);

export default surveyModel;