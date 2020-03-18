export class AnswerDto{
    private id: String;
    private idSurvey: String;
    private answers: Object[];

    constructor(){
        this.id = "";
        this.idSurvey = "";
        this.answers = [];
    }

    public getId():String {
        return this.id;
    }

    public setId(id:String):void {
        this.id = id;
    }

    public getIdSurvey():String {
        return this.idSurvey;
    }

    public setIdSurvey(idSurvey:String):void {
        this.idSurvey = idSurvey;
    }

    public getAnswers():Object[] {
        return this.answers;
    }

    public setAnswers(answers:Object[]):void {
        this.answers = answers;
    }
}