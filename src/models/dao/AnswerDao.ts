import AnswernModel from '../AnswerModel';
import { AnswerDto } from '../dto/AnswerDto';
import { Answer } from '../../interfaces/answer.interface';

export class AnswerDao {

    constructor() { }

    public async createAnswer(answer: AnswerDto):Promise<void> {
        const answerData = new AnswernModel({
            idSurvey: answer.getIdSurvey(),
            answers: answer.getAnswers()
        });
        await answerData.save();
    }

    public async findAllAnswers(answer:AnswerDto): Promise<Answer[]>{
        const response = await AnswernModel.find({idSurvey: answer.getIdSurvey()});
        return response;
    }

    public async deleteAllAnswers(answer:AnswerDto):Promise<void> {
        await AnswernModel.deleteMany({idSurvey: answer.getIdSurvey()});
    }
}