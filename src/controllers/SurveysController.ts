import { Request, Response, json } from 'express';
import { SurveyDao } from '../models/dao/SurveyDao';
import { SurveyDto } from '../models/dto/SurveyDto';
import { Survey } from '../interfaces/survey.interface';
import { questionController } from './QuestionsController';
import helper from '../lib/helpers'
import url from 'url';
import { QuestionDto } from '../models/dto/QuestionDto';
import { QuestionDao } from '../models/dao/QuestionDao';
import XLSX from 'xlsx';
import path from 'path';
import { AnswerDto } from '../models/dto/AnswerDto';
import { AnswerDao } from '../models/dao/AnswerDao';

class SurveysController {

    public createSurvey(req: Request, res: Response): void {
        const errorr = [];
        const { title, introduction, timeEstimated, securityCode, initDate, endDate } = req.body;
        if (!title || !introduction || !timeEstimated || !securityCode || !initDate || !endDate) {
            req.flash('error_msg', 'Debe diligenciar todos los campos');
            errorr.push({ msg: 'Debe diligenciar todos los campos' });
        } else {
            if (helper.validateDate(initDate, endDate)) {
                const surveyDto = new SurveyDto();
                surveyDto.setTitle(title);
                surveyDto.setIntroduction(introduction);
                surveyDto.setTimeEstimated(timeEstimated);
                surveyDto.setSecurityCode(securityCode);
                surveyDto.setInitDate(initDate);
                surveyDto.setEndDate(endDate);
                surveyDto.setAnswerCount(0);

                const surveyDao = new SurveyDao();
                const p = surveyDao.createSurvey(surveyDto);
                req.flash('success_msg', 'Encuesta creada');
                return res.redirect('/surveys/all');
            } else {
                req.flash('error_msg', 'La fecha final debe ser posterior a la fecha inicial');
                errorr.push({ msg: 'La fecha final debe ser posterior a la fecha inicial' });
            }
        }
        res.render('surveys/create', { title, introduction, timeEstimated, securityCode, initDate, endDate, errorr });
    }

    public async confirmDelete(req: Request, res: Response): Promise<void> {
        const msg = '¿Desea eliminar la encuesta?. ¡Una vez eliminada no podrá recuperarla!';
        const redirect = '/surveys/delete/' + req.params.id;
        const surveyDao = new SurveyDao();
        const surveydata = await surveyDao.findAllSurvey();
        res.render('surveys/all-surveys', { surveydata, msg, redirect });
    }

    public async confirmSecurityCode(req: Request, res: Response): Promise<void> {
        const idSurvey = req.params.id;
        const { codeSecurity, codeSecuritySurvey } = req.body;
        if (codeSecurity == codeSecuritySurvey) {
            const done = true;

            if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
                const idSurvey = req.params.id;
                const response = await questionController.findAllQuestions(idSurvey);

                const surveyDto = new SurveyDto();
                surveyDto.setId(idSurvey);
                const surveyDao = new SurveyDao();
                const surveyData = await surveyDao.findSurvey(surveyDto);

                let title, introduction, timeEstimated, state, securityCode, endDate;
                if (surveyData) {
                    title = surveyData['title'];
                    introduction = surveyData['introduction'];
                    timeEstimated = surveyData['timeEstimated'];
                    state = surveyData['state'];
                    endDate = surveyData['endDate'];
                    securityCode = surveyData['securityCode'];

                    res.render('surveys/surveyPublic', { response, idSurvey, title, introduction, timeEstimated, state, securityCode, done });
                } else {
                    req.flash('error_msg', 'La encuesta no existe');
                    return res.redirect('/users/login');
                }
            } else {
                req.flash('error_msg', 'La encuesta no existe');
                return res.redirect('/users/login');
            }

        } else {
            req.flash('error_msg', 'Código incorrecto');
            res.redirect('/users/login');
        }
    }

    public editSurvey(req: Request, res: Response): void {
        const { title, introduction, timeEstimated, securityCode, initDate, endDate } = req.body;
        const errorr = [];

        if (!title || !introduction || !timeEstimated || !securityCode || !initDate || !endDate) {
            req.flash('error_msg', 'Debe diligenciar todos los campos');
            errorr.push({ msg: 'Debe diligenciar todos los campos' });
        } else {
            if (helper.validateDate(initDate, endDate)) {
                const surveyDto = new SurveyDto();
                surveyDto.setId(req.params.id);
                surveyDto.setTitle(title);
                surveyDto.setIntroduction(introduction);
                surveyDto.setTimeEstimated(timeEstimated);
                surveyDto.setSecurityCode(securityCode);
                surveyDto.setInitDate(initDate);
                surveyDto.setEndDate(endDate);

                const surveyDao = new SurveyDao();
                surveyDao.editSurvey(surveyDto);
                req.flash('success_msg', 'Cambios guardados');
                return res.redirect('/surveys/all');
            } else {
                req.flash('error_msg', 'La fecha final debe ser posterior a la fecha inicial');
                errorr.push({ msg: 'La fecha final debe ser posterior a la fecha inicial' });
            }
        }
        res.render('surveys/create', { title, introduction, timeEstimated, securityCode, initDate, endDate, errorr });
    };

    public async deleteSurvey(req: Request, res: Response): Promise<void> {
        if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            const surveyDto = new SurveyDto();
            surveyDto.setId(req.params.id);

            const surveyDao = new SurveyDao();
            const response = await surveyDao.deleteSurvey(surveyDto);
            if (response) {
                req.flash('success_msg', 'Encuesta eliminada');

                //Delete all questions related to survey
                const questionDto = new QuestionDto();
                questionDto.setIdSurvey(req.params.id);
                const questionDao = new QuestionDao();
                await questionDao.deleteAllQuestion(questionDto);

                //Delete all answers related to survey
                const answerDto = new AnswerDto();
                answerDto.setIdSurvey(req.params.id);
                const answerDao = new AnswerDao();
                await answerDao.deleteAllAnswers(answerDto);

                res.redirect('/surveys/all');
            } else {
                req.flash('error_msg', 'No se pudo eliminar la encuesta');
                res.redirect('/surveys/all');
            }
        } else {
            req.flash('error_msg', 'No se pudo eliminar la encuesta');
            res.redirect('/surveys/all');
        }
    };

    public questionConfirmDelete(req: Request, res: Response): void {
        questionController.deleteQuestion(req, res);
    }

    public async confirmPublicateSurvey(req: Request, res: Response): Promise<void> {
        const msg = '¿Desea publicar la encuesta?. ¡Una vez publicada no podrá editar la encuesta!';
        const redirect = '/surveys/publicate-survey/' + req.params.id;
        const surveyDao = new SurveyDao();
        const surveydata = await surveyDao.findAllSurvey();
        res.render('surveys/all-surveys', { surveydata, msg, redirect });
    }

    public async publicateSurvey(req: Request, res: Response): Promise<void> {
        const idSurvey = req.params.id;
        const surveyDto = new SurveyDto();
        surveyDto.setId(idSurvey);
        surveyDto.setState('Publicada');

        const surveyDao = new SurveyDao();
        const response = await surveyDao.editStateSurvey(surveyDto);
        if (response != null) {
            req.flash('success_msg', 'Encuesta publicada');
        } else {
            req.flash('error_msg', 'A ocurrido un error al intentar publicar la encuesta');
        }
        const surveydata = await surveyDao.findAllSurvey();
        res.redirect('/surveys/all');
    }

    public async showLink(req: Request, res: Response): Promise<void> {
        if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            const surveyDto = new SurveyDto();
            surveyDto.setId(req.params.id);
            const surveyDao = new SurveyDao();
            const surveyData = await surveyDao.findSurvey(surveyDto);

            if (surveyData) {
                const urlpage = url.format({
                    protocol: req.protocol,
                    host: req.get('host')
                });

                const msg = `Código de la encuesta: ${surveyData['securityCode']}.
                Enlace: ${urlpage}/surveys/public/${req.params.id}`;
                const redirect = '/surveys/all';
                const surveyDao = new SurveyDao();
                const surveydata = await surveyDao.findAllSurvey();
                res.render('surveys/all-surveys', { surveydata, msg, redirect });
            } else {
                req.flash('error_msg', 'La encuesta no existe');
                return res.redirect('/users/login');
            }
        } else {
            req.flash('error_msg', 'La encuesta no existe');
            return res.redirect('/users/login');
        }
    }

    public async publicSurvey(req: Request, res: Response): Promise<void> {
        if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            const idSurvey = req.params.id;
            const response = await questionController.findAllQuestions(idSurvey);

            const surveyDto = new SurveyDto();
            surveyDto.setId(idSurvey);
            const surveyDao = new SurveyDao();
            const surveyData = await surveyDao.findSurvey(surveyDto);

            let title, introduction, timeEstimated, state, securityCode, endDate;
            if (surveyData) {
                title = surveyData['title'];
                introduction = surveyData['introduction'];
                timeEstimated = surveyData['timeEstimated'];
                state = surveyData['state'];
                endDate = surveyData['endDate'];
                securityCode = surveyData['securityCode'];

                if (state != 'Publicada') {
                    req.flash('error_msg', 'La encuesta no se encuentra publicada');
                    return res.redirect('/users/login');
                } else {
                    let month = "";
                    const date = new Date();
                    if (date.getMonth() + 1 < 10) {
                        month = '0' + (date.getMonth() + 1);
                    }
                    const currentDate = `${date.getFullYear()}-${month}-${date.getDate()}`;
                    //Pregunta si la fecha actual es mayor a la fecha de cierre de la encuesta
                    if (helper.validateDate(endDate, currentDate)) {
                        req.flash('error_msg', 'La encuesta no se encuentra publicada');
                        return res.redirect('/surveys/all');
                    } else {
                        res.render('surveys/surveyPublic', { response, idSurvey, title, introduction, timeEstimated, state, securityCode });
                    }
                }
            } else {
                req.flash('error_msg', 'La encuesta no existe');
                return res.redirect('/users/login');
            }
        } else {
            req.flash('error_msg', 'La encuesta no existe');
            return res.redirect('/users/login');
        }
    }

    public renderCreate(req: Request, res: Response): void {
        res.render('surveys/create');
    };

    public async renderAllSurveys(req: Request, res: Response): Promise<void> {
        const surveyDao = new SurveyDao();
        const surveydata = await surveyDao.findAllSurvey();

        res.render('surveys/all-surveys', { surveydata });
    };

    public async exportSurvey(req: Request, res: Response): Promise<void> {
        const idSurvey = req.params.id;
        if (idSurvey.match(/^[0-9a-fA-F]{24}$/)) {

            const surveyDto = new SurveyDto();
            surveyDto.setId(idSurvey);
            const surveyDao = new SurveyDao();

            const surveyData = await surveyDao.findSurvey(surveyDto);
            if (surveyData) {
                if (surveyData['answerCount'] > 0) {
                    const questionDto = new QuestionDto();
                    questionDto.setIdSurvey(idSurvey);
                    const questionDao = new QuestionDao();
                    const questionData = await questionDao.findAllQuestions(questionDto);

                    const answerDto = new AnswerDto();
                    answerDto.setIdSurvey(idSurvey);
                    const answerDao = new AnswerDao();
                    const answerData = await answerDao.findAllAnswers(answerDto);

                    //construir array de objetos para exportarlo a excel
                    const data = helper.createObjetToExport(questionData, answerData, idSurvey);

                    var wb = XLSX.utils.book_new();
                    var ws = XLSX.utils.json_to_sheet(data);
                    var down = path.join(__dirname, '../public/answers.xlsx');
                    XLSX.utils.book_append_sheet(wb, ws, 'sheet1');
                    XLSX.writeFile(wb, down);
                    res.download(down);
                } else {
                    req.flash('error_msg', 'La encuesta debe estar diligenciada por lo menos una vez para poder exportar los datos');
                    res.redirect('/surveys/all');
                }
            } else {
                req.flash('error_msg', 'La encuesta no existe');
                return res.redirect('/surveys/all');
            }
        } else {
            req.flash('error_msg', 'La encuesta no existe');
            return res.redirect('/surveys/all');
        }
    }

    public async renderManageQuestions(req: Request, res: Response): Promise<void> {
        if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            const idSurvey = req.params.id;
            const response = await questionController.findAllQuestions(idSurvey);

            const surveyDto = new SurveyDto();
            surveyDto.setId(idSurvey);
            const surveyDao = new SurveyDao();
            const surveyData = await surveyDao.findSurvey(surveyDto);

            let title, introduction, timeEstimated;
            if (surveyData) {
                title = surveyData['title'];
                introduction = surveyData['introduction'];
                timeEstimated = surveyData['timeEstimated'];
            } else {
                req.flash('error_msg', 'La encuesta no existe');
                return res.redirect('/surveys/all');
            }
            res.render('surveys/managequestions', { response, idSurvey, title, introduction, timeEstimated });

        } else {
            req.flash('error_msg', 'La encuesta no existe');
            return res.redirect('/surveys/all');
        }
    };

    public async renderEdit(req: Request, res: Response): Promise<void> {
        if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            const surveyDto = new SurveyDto();
            surveyDto.setId(req.params.id);

            const surveyDao = new SurveyDao();
            const surveydata = await surveyDao.findSurvey(surveyDto);

            if (surveydata) {
                res.render('surveys/edit', surveydata);
            } else {
                req.flash('error_msg', 'La encuesta no exite');
                res.redirect('/surveys/all');
            }
        } else {
            req.flash('error_msg', 'La encuesta no exite');
            res.redirect('/surveys/all');
        }

    };

    public async renderSurvey(req: Request, res: Response): Promise<void> {
        if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            const idSurvey = req.params.id;
            const response = await questionController.findAllQuestions(idSurvey);

            const surveyDto = new SurveyDto();
            surveyDto.setId(idSurvey);
            const surveyDao = new SurveyDao();
            const surveyData = await surveyDao.findSurvey(surveyDto);

            let title, introduction, timeEstimated;
            if (surveyData) {
                title = surveyData['title'];
                introduction = surveyData['introduction'];
                timeEstimated = surveyData['timeEstimated'];
            } else {
                req.flash('error_msg', 'La encuesta no existe');
                return res.redirect('/surveys/all');
            }
            res.render('surveys/survey', { response, idSurvey, title, introduction, timeEstimated });
        } else {
            req.flash('error_msg', 'La encuesta no existe');
            return res.redirect('/surveys/all');
        }
    };
}

export const surveyController = new SurveysController();
