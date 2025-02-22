import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { PerfumeDTO } from "src/core/dto/perfume.dto";
import { PerfumeEntity } from "src/core/entities/perfume.entity";
import { PerfumeInterface } from "src/core/interfaces/perfume.interface";
import { Perfume as PerfumeDocument } from "../db/schemas/perfume.schema";
import { Model } from "mongoose";
import { GetPerfumeIndexScreenDto } from "src/core/dto/get/perfume-get-index.dto";

@Injectable()
export class PerfumeRepositoryImpl implements PerfumeInterface {
    constructor(@InjectModel(PerfumeDocument.name) private readonly perfumeModel: Model<PerfumeDocument>) {}

    async getIndexScreen(): Promise<GetPerfumeIndexScreenDto[]> {
        const perfumes = await this.perfumeModel.find({}, '_id name image brand').populate('brand'); 
        return perfumes.map(perfume => new GetPerfumeIndexScreenDto(perfume._id, perfume.name, perfume.image, perfume.brand));
    }
    

    async store(perfumeDto: PerfumeDTO): Promise<PerfumeEntity> {
        const existingPerfume = await this.perfumeModel.findOne({ name: perfumeDto.name }).exec();
        if (existingPerfume) throw new Error('Perfume already exists');

        perfumeDto.topNotes = typeof perfumeDto.topNotes === 'string' ? JSON.parse(perfumeDto.topNotes) : perfumeDto.topNotes;
        perfumeDto.middleNotes = typeof perfumeDto.middleNotes === 'string' ? JSON.parse(perfumeDto.middleNotes) : perfumeDto.middleNotes;
        perfumeDto.baseNotes = typeof perfumeDto.baseNotes === 'string' ? JSON.parse(perfumeDto.baseNotes) : perfumeDto.baseNotes;

        const createdPerfume = new this.perfumeModel(perfumeDto);
        const savedPerfume = await createdPerfume.save();
        
        return new PerfumeEntity(
            savedPerfume.name,
            savedPerfume.image,
            savedPerfume.brand,
            savedPerfume.topNotes,
            savedPerfume.middleNotes,
            savedPerfume.baseNotes
        );
    }

    async index() {
        const perfumes = await this.perfumeModel.find().populate('brand')
        .populate({ path: 'brand' })  
        .populate({ path: 'topNotes' })  
        .populate({ path: 'middleNotes' })
        .populate({ path: 'baseNotes' })  
        .exec();
        return perfumes
    }

    async show(id: string) {
        const perfume = await this.perfumeModel.findById(id).populate('brand')
        .populate('topNotes') 
        .populate('middleNotes') 
        .populate('baseNotes') .exec()
        if (!perfume) throw new NotFoundException('Perfume not found');
        return perfume
    }

    async update(id: string, perfumeDto: PerfumeDTO): Promise<{ message: string }> {
        const updatedPerfume = await this.perfumeModel.findByIdAndUpdate(id, perfumeDto, { new: true }).lean();
        if (!updatedPerfume) throw new NotFoundException('Perfume not found');
        return { message: 'Perfume updated successfully' };
    }

    async delete(id: string): Promise<{ message: string }> {
        const deletedPerfume = await this.perfumeModel.findByIdAndDelete(id).lean();
        if (!deletedPerfume) throw new NotFoundException('Perfume not found');
        return { message: 'Perfume deleted successfully' };
    }

    
}
