export class BrandDTO{
    readonly name : string;
    readonly image : string;
    readonly description : string;
    readonly country : string;
    readonly founded : number;

    constructor(name: string, image: string, description: string , country: string, founded: number){
        this.name = name;
        this.image = image;
        this.description = description;
        this.country = country;
        this.founded = founded
    }
}