export class GetBrandIndexScreenDto {
    constructor(
      public readonly _id: any,  
      public readonly name: string,
      public readonly image: string,
      public readonly description: string,
      public readonly country : string
    ) {}
  }
  