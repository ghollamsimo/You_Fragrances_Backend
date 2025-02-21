import { Types } from 'mongoose';

export class GetPerfumeIndexScreenDto {
    constructor(
        public _id: Types.ObjectId,  
        public name: string,
        public image: string,
        public brand: string
    ) {}
}
