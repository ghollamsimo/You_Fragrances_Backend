export class GetPerfumeIndexScreenDto {
  constructor(
    public _id: string, 
    public name: string,
    public image: string,
    public brand: string, 
    public averageRating: number = 0
  ) {}
}