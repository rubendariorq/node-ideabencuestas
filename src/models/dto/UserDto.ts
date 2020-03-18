export class UserDto{
    private email:String;
    private name:String;
    private password:String;

    constructor(){
        this.email = "";
        this.name = "";
        this.password = "";
    }

    public getEmail():String {
        return this.email;
    }

    public setEmail(email:String):void {
        this.email = email;
    }

    public getName():String {
        return this.name;
    }

    public setName(name:String):void {
        this.name = name;
    }

    public getPassword():String {
        return this.password;
    }

    public setPassword(password:String):void {
        this.password = password;
    }
}