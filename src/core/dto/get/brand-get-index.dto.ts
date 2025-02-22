export class GetBrandIndexScreenDto {
    constructor(
      public readonly _id: string,  
      public readonly name: string,
      public readonly image: string,
      public readonly description: string
    ) {}
  }
  