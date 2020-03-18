import QuestionModel from '../QuestionModel';
import { QuestionDto } from '../dto/QuestionDto';
import { Question } from '../../interfaces/question.interface';

export class QuestionDao{

    constructor(){}

    public async addQuestion(questionDto: QuestionDto): Promise<Question> {
        const question = new QuestionModel({
            idSurvey: questionDto.getIdSurvey(),
            questiontype: questionDto.getQuestionType(),
            question: questionDto.getQuestion(),
            order: questionDto.getOrder(),
            options: questionDto.getOptions(),
            isOther: questionDto.getIsOther()
        });
        question.save();
        return question;
    }

    public async findQuestion(questionDto:QuestionDto): Promise<Question|null>{
        const response = await QuestionModel.findOne({
            order: questionDto.getOrder(),
            idSurvey: questionDto.getIdSurvey()
        });
        return response;
    }

    public async findQuestionDirection(questionDto:QuestionDto): Promise<Question|null>{
        const response = await QuestionModel.findOne({
            idSurvey: questionDto.getIdSurvey(),
            questiontype: questionDto.getQuestionType()
        });
        return response;
    }

    public async findAllQuestions(questionDto:QuestionDto): Promise<Question[]>{
        const response = await QuestionModel.find({idSurvey: questionDto.getIdSurvey()}).sort({order: 'asc'});
        return response;
    }

    public async deleteQuestion(question:QuestionDto):Promise<Question|null> {
        const questiondata = await QuestionModel.findByIdAndDelete({_id: question.getId()});
        return questiondata;
    }

    public async deleteAllQuestion(question:QuestionDto):Promise<void> {
        await QuestionModel.deleteMany({idSurvey: question.getIdSurvey()});
    }
}