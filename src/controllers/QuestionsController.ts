import { Request, Response } from 'express';
import { QuestionDao } from '../models/dao/QuestionDao';
import { QuestionDto } from '../models/dto/QuestionDto';
import helper from '../lib/helpers'
import { Question } from '../interfaces/question.interface';

class QuestionController {

    public async addQuestion(req: Request, res: Response): Promise<void> {
        const { order, question, questiontype, other } = req.body;
        const idSurvey = req.params.id;
        let response;

        if (!question || !questiontype || !order) {
            req.flash('error_msg', 'Debe diligenciar todos los campos');
        } else {
            const questionDto = new QuestionDto();
            questionDto.setIdSurvey(idSurvey);
            questionDto.setQuestionType(questiontype);
            questionDto.setQuestion(question);
            questionDto.setOrder(order);
            questionDto.setIsOther(other);

            const questionDao = new QuestionDao();
            response = await questionDao.findQuestion(questionDto);
            if (response) {
                req.flash('error_msg', 'Ya existe una pregunta con ese número de pregunta');
            } else {
                if (questiontype == "openShort" || questiontype == "openLong" || questiontype == "direction") {
                    //Question if already exist a question type direction
                    const questionData:Question|null = await questionDao.findQuestionDirection(questionDto);
                    if(questionData?.questiontype == "direction"){
                        req.flash('error_msg', "Solo se puede crear una pregunta de tipo dirección por cada encuesta");
                    }else{
                        await questionDao.addQuestion(questionDto);
                        req.flash('success_msg', 'Pregunta creada');
                    }
                } else {
                    if (questiontype == "smur") {
                        const options = helper.encapsulateOptions(req);
                        questionDto.setOptions(options);
                        const questionDao = new QuestionDao();
                        await questionDao.addQuestion(questionDto);
                        req.flash('success_msg', 'Pregunta creada');
                    } else {
                        req.flash('error_msg', "El tipo de pregunta seleccionado no existe");
                    }
                }
            }
        }
        res.redirect(`/surveys/managequestions/${idSurvey}`);
    }

    public async findAllQuestions(idSurvey:String):Promise<Question[]>{
        const questionDto = new QuestionDto();
        questionDto.setIdSurvey(idSurvey);

        const questionDao = new QuestionDao();
        const response = await questionDao.findAllQuestions(questionDto);
        return response;
    }

    public async deleteQuestion(req: Request, res: Response):Promise<void> {
        if (req.params.idSurvey.match(/^[0-9a-fA-F]{24}$/) && req.params.idQuestion.match(/^[0-9a-fA-F]{24}$/)) {
            const questionDto = new QuestionDto();
            questionDto.setId(req.params.idQuestion);

            const questionDao = new QuestionDao();
            const response = await questionDao.deleteQuestion(questionDto);
            if (response) {
                req.flash('success_msg', 'Pregunta eliminada');
            } else {
                req.flash('error_msg', 'No se pudo eliminar la pregunta');
            }
        } else {
            req.flash('error_msg', 'No se pudo eliminar la pregunta');
        }
        res.redirect(`/surveys/managequestions/${req.params.idSurvey}`);
    }
}

export const questionController = new QuestionController();