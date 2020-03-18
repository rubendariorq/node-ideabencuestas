import { Request, Response } from 'express';
import { AnswerDao } from '../models/dao/AnswerDao';
import { AnswerDto } from '../models/dto/AnswerDto';
import { Answer } from '../interfaces/answer.interface';
import { SurveyDto } from '../models/dto/SurveyDto';
import { SurveyDao } from '../models/dao/SurveyDao';
import helper from '../lib/helpers';

class AnswerController {

    public async registerAnswers(req: Request, res: Response): Promise<void> {
        const idSurvey = req.params.id;

        if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            const surveyDto = new SurveyDto();
            surveyDto.setId(idSurvey);
            const surveyDao = new SurveyDao();
            const survey = await surveyDao.findSurvey(surveyDto);

            if (survey) {

                const answerArray = helper.encapsulateAnswers(req);
                
                const answerDto = new AnswerDto();
                answerDto.setIdSurvey(idSurvey);
                answerDto.setAnswers(answerArray);
                const answerDao = new AnswerDao();
                await answerDao.createAnswer(answerDto);

                const surveyDto = new SurveyDto();
                surveyDto.setId(idSurvey);
                const surveyDao = new SurveyDao();
                await surveyDao.editCountAnswerSurvey(surveyDto);

                req.flash('success_msg', 'Encuesta enviada. Gracias por su participación');
                res.redirect(`/surveys/public/${idSurvey}`);
            } else {
                req.flash('error_msg', 'La encuesta no existe');
                res.redirect(`/surveys/public/${idSurvey}`)
            }
        } else {
            req.flash('error_msg', 'La encuesta no existe');
            res.redirect(`/surveys/public/${idSurvey}`)
        }
    }
}

export const answerController = new AnswerController();