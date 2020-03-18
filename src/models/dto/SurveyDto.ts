export class SurveyDto{
    private id:String;
    private title:String;
    private introduction:String;
    private timeEstimated: String;
    private securityCode:String;
    private initDate:String;
    private endDate:String;
    private state:String;
    private answerCount: Number

    constructor(){
        this.id = "";
        this.title = "";
        this.introduction = "";
        this.timeEstimated = "";
        this.securityCode = "";
        this.initDate = "";
        this.endDate = "";
        this.state = "";
        this.answerCount = 0;
    }

    public getId():String {
        return this.id;
    }

    public setId(id:String):void {
        this.id = id;
    }

    public getTitle():String {
        return this.title;
    }

    public setTitle(title:String):void {
        this.title = title;
    }

    public getIntroduction():String {
        return this.introduction;
    }

    public setIntroduction(introduction:String):void {
        this.introduction = introduction;
    }

    public getTimeEstimated():String {
        return this.timeEstimated;
    }

    public setTimeEstimated(timeEstimated:String):void {
        this.timeEstimated = timeEstimated;
    }

    public getSecurityCode():String {
        return this.securityCode;
    }

    public setSecurityCode(securityCode:String):void {
        this.securityCode = securityCode;
    }

    public getInitDate():String {
        return this.initDate;
    }

    public setInitDate(initDate:String):void {
        this.initDate = initDate;
    }

    public getEndDate():String {
        return this.endDate;
    }

    public setEndDate(endDate:String):void {
        this.endDate = endDate;
    }

    public getState():String {
        return this.state;
    }

    public setState(state:String):void {
        this.state = state;
    }

    public getAnswerCount():Number {
        return this.answerCount;
    }

    public setAnswerCount(answerCount:Number):void {
        this.answerCount = answerCount;
    }
}