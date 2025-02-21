import {Schema as MongooseSchema } from 'mongoose';

export class PerfumeEntity {

    constructor(private readonly name: string,
        private readonly image: string,
        private readonly brand: string,
        private readonly topNotes: MongooseSchema.Types.ObjectId
,
        private readonly middleNotes: MongooseSchema.Types.ObjectId
,
        private readonly baseNotes: MongooseSchema.Types.ObjectId
) {
    }
  }
  