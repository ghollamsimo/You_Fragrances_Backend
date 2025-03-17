export class PerfumeDTO {
  constructor(
    public name: string,
    public image: string,
    public brand: string,
    public topNotes: string[], 
    public middleNotes: string[], 
    public baseNotes: string[], 
    public TargetAudience: string,
    public Volume: string,
    public Concentration: string,
    public sillage: string,
    public Barcode: string
  ) {}
}