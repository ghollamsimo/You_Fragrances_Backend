export class BrandDTO {
    name: string;
    image?: string; 
    description: string;
    country: string;
    founded: number;

    constructor(name: string, image: string, description: string, country: string, founded: number) {
        this.name = name;
        this.image = image;
        this.description = description;
        this.country = country;
        this.founded = founded;
    }
}
