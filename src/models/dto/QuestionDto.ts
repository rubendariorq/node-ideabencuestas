export class QuestionDto{
    private id:String;
    private idSurvey:String;
    private questiontype: String;
    private question: String;
    private order: String;
    private options: Object[];
    private isOther: boolean;

    constructor(){
        this.id = "";
        this.idSurvey = "";
        this.questiontype = "";
        this.question = "";
        this.order = "";
        this.options = [];
        this.isOther = false;
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

    public getQuestionType():String {
        return this.questiontype;
    }

    public setQuestionType(questionType:String):void {
        this.questiontype = questionType;
    }

    public getQuestion():String {
        return this.question;
    }

    public setQuestion(question:String):void {
        this.question = question;
    }

    public getOrder():String {
        return this.order;
    }

    public setOrder(order:String):void {
        this.order = order;
    }

    public getOptions():Object[] {
        return this.options;
    }

    public setOptions(options:Object[]):void {
        this.options = options;
    }

    public getIsOther():boolean {
        return this.isOther;
    }

    public setIsOther(isOther:boolean):void {
        this.isOther = isOther;
    }
}