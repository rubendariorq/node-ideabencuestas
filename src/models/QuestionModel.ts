import mongoose, { Schema } from 'mongoose';
import { Question } from '../interfaces/question.interface';

const QuestionSchema = new Schema({
    idSurvey: String,
    questiontype: String,
    question: String,
    order: String,
    options: [{
        opc: String,
        orderQuestion: String
    }],
    isOther: String
});

const questionModel = mongoose.model<Question>('Question', QuestionSchema);

export default questionModel;