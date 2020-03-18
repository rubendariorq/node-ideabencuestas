import mongoose, { Schema } from 'mongoose';
import { Answer } from '../interfaces/answer.interface';

const UserSchema = new Schema({
    id: String,
    idSurvey: String,
    answers: [{
        order: String,
        answer: String
    }]
});

const answerModel = mongoose.model<Answer>('Answer', UserSchema);

export default answerModel;