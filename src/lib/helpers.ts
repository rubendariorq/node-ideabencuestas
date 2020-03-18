import { NextFunction, Request, Response } from "express";
import { Question } from "../interfaces/question.interface";
import { Answer } from "../interfaces/answer.interface";

class Helpers {
    constructor() { }

    public validateDate(initDate: String, endDate: String): boolean {
        const initD = initDate.split('-');
        const endD = endDate.split('-');

        const init = new Date(parseInt(initD[0]), parseInt(initD[1]) - 1, parseInt(initD[2]));
        const end = new Date(parseInt(endD[0]), parseInt(endD[1]) - 1, parseInt(endD[2]));

        if (end > init) {
            return true;
        } else {
            return false;
        }
    }

    public isAuthenticated(req: Request, res: Response, next: NextFunction) {
        if (req.isAuthenticated()) {
            return next();
        }
        req.flash('error_msg', 'No tiene autorizacion para acceder');
        res.redirect('/users/login');
    }

    public encapsulateOptions(req: Request): Object[] {
        const data = req.body;
        const order = data['order'];
        let options: Object[] = [];
        let i = 0;

        for (let clave in data) {
            i++;
            if (i > 3) {
                options.push({
                    opc: data[clave],
                    orderQuestion: order
                });
            }
        }
        console.log(data['other']);
        if (data['other'] == 'yes') {
            options.pop();
        }

        return options;
    }

    public encapsulateAnswers(req: Request): Object[] {
        const data = req.body;
        let answers: Object[] = [];

        for (let clave in data) {
            answers.push({
                order: clave,
                answer: data[clave]
            });
        }
        return answers;
    }

    public createObjetToExport(questions: Question[], answers: Answer[], idSurvey: String) {

        //Create an array of tags
        const tagsQuestion = [];
        tagsQuestion.push('idSurvey');
        questions.forEach(element => {
            tagsQuestion.push(element['question']);
        });

        //Get the answers from each survey
        let dataTransfer = "[";
        
        let i = 0;
        while (i < answers.length) {
            let objectText = `{"idSurvey":"${idSurvey}"`;

            const answer = answers[i]['answers'];
            let j = 0;
            while (j < answer.length) {
                const data = answer[j];
                const temp = JSON.stringify(data);
                const dataParse = JSON.parse(temp);

                objectText += `,"${tagsQuestion[j+1]}":"${dataParse['answer']}"`
                if(j == (answer.length-1)){
                    objectText += '}'
                }
                j++;
            }
            dataTransfer += objectText;
            if(i < (answers.length-1)){
                dataTransfer += ',';
            }
            if(i == (answers.length-1)){
                dataTransfer += ']';
            }
            i++;
        }
        return JSON.parse(dataTransfer);
    }
}

const helper = new Helpers();
export default helper;