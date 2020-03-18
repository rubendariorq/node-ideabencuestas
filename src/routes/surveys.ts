import { Router } from 'express';
import { surveyController } from '../controllers/SurveysController';
import { questionController } from '../controllers/QuestionsController';
import { answerController } from '../controllers/AnswerController';
import helpers from '../lib/helpers';
import helper from '../lib/helpers';

const router:Router = Router();

router.get('/create', helper.isAuthenticated, surveyController.renderCreate);
router.get('/all', helper.isAuthenticated, surveyController.renderAllSurveys);
router.get('/managequestions/:id', helper.isAuthenticated, surveyController.renderManageQuestions);
router.get('/edit/:id', helper.isAuthenticated, surveyController.renderEdit);
router.get('/:id', helper.isAuthenticated, surveyController.renderSurvey);
router.get('/delete/:id', helper.isAuthenticated, surveyController.deleteSurvey);
router.get('/confirm-delete/:id', helper.isAuthenticated, surveyController.confirmDelete);
router.get('/question-confirm-delete/:idSurvey/:idQuestion', helper.isAuthenticated, surveyController.questionConfirmDelete);
router.get('/confirm-publicate-survey/:id', helper.isAuthenticated, surveyController.confirmPublicateSurvey);
router.get('/publicate-survey/:id', helper.isAuthenticated, surveyController.publicateSurvey);
router.get('/public/:id', helper.isAuthenticated, surveyController.publicSurvey);
router.get('/see-link/:id', helper.isAuthenticated, surveyController.showLink);
router.get('/export/:id', helper.isAuthenticated, surveyController.exportSurvey);
router.post('/create', helper.isAuthenticated, surveyController.createSurvey);
router.post('/edit/:id', helper.isAuthenticated, surveyController.editSurvey);
router.post('/add-question/:id', helper.isAuthenticated, questionController.addQuestion);
router.post('/public/:id', surveyController.confirmSecurityCode);
router.post('/register-answers/:id', helper.isAuthenticated, answerController.registerAnswers);

export default router;