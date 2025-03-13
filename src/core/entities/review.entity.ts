export class ReviewEntity{
    constructor(private readonly user: string , private readonly perfume: string, private readonly rating: number, private readonly comment: string, private readonly recommended: boolean){}
}