export class BrandDTO{
    readonly name : string;
    readonly image : string;
    readonly description : string;
    readonly type : any;

    constructor(name: string, image: string, description: string , type: any){
        this.name = name;
        this.image = image;
        this.description = description;
        this.type = type;
    }
}