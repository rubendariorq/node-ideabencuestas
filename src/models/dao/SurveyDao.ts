import SurveyModel from '../SurveyModel';
import { Survey } from '../../interfaces/survey.interface';
import { SurveyDto } from '../dto/SurveyDto';
import { Request, Response } from 'express';

export class SurveyDao {

    constructor() { }

    public async createSurvey(survey: SurveyDto):Promise<void> {
        const surveydata = new SurveyModel({ 
            title: survey.getTitle(),
            introduction: survey.getIntroduction(),
            timeEstimated: survey.getTimeEstimated(),
            securityCode: survey.getSecurityCode(),
            initDate: survey.getInitDate(),
            endDate: survey.getEndDate(),
            state: 'Creada',
            answerCount: survey.getAnswerCount() 
        });
        await surveydata.save();
    }

    public async editCountAnswerSurvey(survey:SurveyDto):Promise<Survey|null> {
        const surveyData = await SurveyModel.findOneAndUpdate({_id: survey.getId()}, {
            $inc: { answerCount: 1 }
        });
        return surveyData;
    }

    public async editStateSurvey(survey:SurveyDto):Promise<Survey|null> {
        const surveyData = await SurveyModel.findOneAndUpdate({_id: survey.getId()}, {
            state: survey.getState()
        });
        return surveyData;
    }

    public async findAllSurvey():Promise<Survey[]> {
        const surveyData = await SurveyModel.find();
        return surveyData;
    }

    public async findSurvey(survey:SurveyDto):Promise<Survey|null> {
        const surveyData = await SurveyModel.findOne({"_id": survey.getId()});
        return surveyData;
    }

    public async editSurvey(survey:SurveyDto):Promise<Survey|null> {
        
        const surveyData = await SurveyModel.findOneAndUpdate({_id: survey.getId()}, {
            title: survey.getTitle(),
            introduction: survey.getIntroduction(),
            timeEstimated: survey.getTimeEstimated(),
            securityCode: survey.getSecurityCode(),
            initDate: survey.getInitDate(),
            endDate: survey.getEndDate()
        });
        return surveyData;
    }

    public async deleteSurvey(survey:SurveyDto):Promise<Survey|null> {
        const surveydata = await SurveyModel.findByIdAndDelete({_id: survey.getId()});
        return surveydata;
    }
}