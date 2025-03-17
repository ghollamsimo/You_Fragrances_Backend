import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { PerfumeDTO } from "src/core/dto/perfume.dto";
import { PerfumeEntity } from "src/core/entities/perfume.entity";
import { PerfumeInterface } from "src/core/interfaces/perfume.interface";
import { Perfume, PerfumeDocument } from "../db/schemas/perfume.schema";
import { Review, ReviewDocument } from "../db/schemas/review.schema";
import { Brand, BrandDocument } from "../db/schemas/brand.schema"; 
import { GetPerfumeIndexScreenDto } from "src/core/dto/get/perfume-get-index.dto";

@Injectable()
export class PerfumeRepositoryImpl implements PerfumeInterface {
  constructor(
    @InjectModel(Perfume.name) private readonly perfumeModel: Model<PerfumeDocument>,
    @InjectModel(Review.name) private readonly reviewModel: Model<ReviewDocument>,
    @InjectModel(Brand.name) private readonly brandModel: Model<BrandDocument>,
  ) {}
  
  async getBestPerfume(): Promise<GetPerfumeIndexScreenDto[]> {
    const bestRatedPerfumes = await this.reviewModel.aggregate([
      { $group: { _id: '$perfume', averageRating: { $avg: '$rating' } } },
      { $match: { averageRating: { $gte: 4, $lte: 5 } } }, 
      { $sort: { averageRating: -1 } }, 
      { $limit: 5 }
    ]).exec();

    if (!bestRatedPerfumes.length) return [];  

    const perfumes = await this.perfumeModel
      .find({ _id: { $in: bestRatedPerfumes.map((p) => p._id) } }, '_id name image brand')
      .populate('brand')
      .exec();

    return perfumes.map((perfume) => {
        const perfumeRating = bestRatedPerfumes.find(p => p._id.toString() === perfume._id.toString())?.averageRating || 0;
        return new GetPerfumeIndexScreenDto(
          perfume._id.toString(),
          perfume.name,
          perfume.image,
          (perfume.brand as any).name,
          Number(perfumeRating.toFixed(1)) 
        );
    });
}

  
  
  async getIndexScreen(): Promise<GetPerfumeIndexScreenDto[]> {
    const perfumes = await this.perfumeModel
      .find({}, '_id name image brand')
      .populate('brand')
      .limit(5)
      .exec();
  
    const ratings = await this.reviewModel.aggregate([
      { $group: { _id: '$perfume', averageRating: { $avg: '$rating' } } },
    ]).exec();
  
    const ratingsMap = new Map(
      ratings.map((r) => [r._id.toString(), Number(r.averageRating.toFixed(1))])
    );
  
    return perfumes.map((perfume) => {
      const averageRating = ratingsMap.get(perfume._id.toString()) || 0;
      return new GetPerfumeIndexScreenDto(
        perfume._id.toString(), 
        perfume.name,
        perfume.image,
        (perfume.brand as any).name, 
        averageRating
      );
    });
  }

  async store(perfumeDto: PerfumeDTO): Promise<PerfumeEntity> {
    const existingPerfume = await this.perfumeModel.findOne({ name: perfumeDto.name }).exec();
    if (existingPerfume) throw new BadRequestException('Perfume already exists');

  
    perfumeDto.topNotes = typeof perfumeDto.topNotes === 'string' ? JSON.parse(perfumeDto.topNotes) : perfumeDto.topNotes;
    perfumeDto.middleNotes = typeof perfumeDto.middleNotes === 'string' ? JSON.parse(perfumeDto.middleNotes) : perfumeDto.middleNotes;
    perfumeDto.baseNotes = typeof perfumeDto.baseNotes === 'string' ? JSON.parse(perfumeDto.baseNotes) : perfumeDto.baseNotes;

    
    const brandId = new Types.ObjectId(perfumeDto.brand);
    const brandExists = await this.brandModel.findById(brandId).exec();
    if (!brandExists) throw new BadRequestException(`Brand with ID ${perfumeDto.brand} does not exist`);


    const createdPerfume = new this.perfumeModel(perfumeDto);
    const savedPerfume = await createdPerfume.save();

    return new PerfumeEntity(
      savedPerfume.name,
      savedPerfume.image,
      savedPerfume.brand,
      savedPerfume.topNotes,
      savedPerfume.middleNotes,
      savedPerfume.baseNotes,
      savedPerfume.TargetAudience,
      savedPerfume.Volume,
      savedPerfume.Concentration,
      savedPerfume.sillage,
      savedPerfume.Barcode
    );
  }

  async index() {
    const perfumes = await this.perfumeModel
      .find()
      .populate({ path: 'brand', select: 'name image' })
      .populate({ path: 'topNotes' })
      .populate({ path: 'middleNotes' })
      .populate({ path: 'baseNotes' })
      .exec();

    const ratings = await this.reviewModel.aggregate([
      { $group: { _id: '$perfume', averageRating: { $avg: '$rating' } } },
    ]);

    const ratingsMap = new Map(
      ratings.map((r) => [r._id.toString(), Number(r.averageRating.toFixed(1))])
    );

    const reviews = await this.reviewModel.find().populate('user', 'name image recommended');

    const reviewsMap = new Map();
    reviews.forEach(review => {
        const perfumeId = review.perfume.toString();
        if (!reviewsMap.has(perfumeId)) {
            reviewsMap.set(perfumeId, []);
        }
        reviewsMap.get(perfumeId).push({
            user: review.user,
            rating: review.rating,
            comment: review.comment,
            recommended: review.recommended,
            createdAt: review.createdAt
        });
    });

    return perfumes.map((perfume) => ({
      ...perfume.toObject(),
      averageRating: ratingsMap.get(perfume._id.toString()) || 0,
      reviews: reviewsMap.get(perfume._id.toString()) || [],
    }));
}


  async show(id: string) {
    const perfume = await this.perfumeModel
      .findById(id)
      .populate('brand')
      .populate('topNotes')
      .populate('middleNotes')
      .populate('baseNotes')
      .exec();
    if (!perfume) throw new NotFoundException('Perfume not found');
    return perfume;
  }

  async update(id: string, perfumeDto: PerfumeDTO): Promise<{ message: string }> {
    const updatedPerfume = await this.perfumeModel.findByIdAndUpdate(id, perfumeDto, { new: true });
    if (!updatedPerfume) throw new NotFoundException('Perfume not found');
    return { message: 'Perfume updated successfully' };
  }

  async delete(id: string): Promise<{ message: string }> {
    const deletedPerfume = await this.perfumeModel.findByIdAndDelete(id).lean();
    if (!deletedPerfume) throw new NotFoundException('Perfume not found');
    return { message: 'Perfume deleted successfully' };
  }
}