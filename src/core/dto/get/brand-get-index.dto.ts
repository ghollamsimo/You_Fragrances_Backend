import { Types } from "mongoose";

export class GetBrandIndexScreenDto{
    constructor(
        public _id: Types.ObjectId,  
            public name: string,
            public image: string,
            public description: string
        ){}
}