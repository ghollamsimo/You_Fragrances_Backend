import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Brand as BrandDocument } from "../db/schemas/brand.schema";
import { Model } from "mongoose";
import { BrandInterface } from "src/core/interfaces/brand.interface";
import { BrandEntity } from "src/core/entities/brand.entity";
import { BrandDTO } from "src/core/dto/brand.dto";
import { GetBrandIndexScreenDto } from "src/core/dto/get/brand-get-index.dto";

@Injectable()
export class BrandRepositoryImpl implements BrandInterface {
  constructor(@InjectModel(BrandDocument.name) private readonly brandModel: Model<BrandDocument>) {}

  async getIndexScreen(): Promise<GetBrandIndexScreenDto[]> {
    const brands = await this.brandModel.find({}, '_id name image description country').lean()
    return brands.map(brand => new GetBrandIndexScreenDto(brand._id, brand.name, brand.image, brand.description , brand.country))
  }

  async store(brandDTO: BrandDTO): Promise<BrandEntity> {
    const existingBrand = await this.brandModel.findOne({ name: brandDTO.name }).exec();
    if (existingBrand) throw new Error('Brand already exists');
    const createdBrand = new this.brandModel(brandDTO);
    const savedBrand = await createdBrand.save();
    return new BrandEntity(savedBrand.name, savedBrand.image, savedBrand.description, savedBrand.country, savedBrand.founded);
  }

  async delete(id: string): Promise<{ message: string }> {
    const deletedBrand = await this.brandModel.findByIdAndDelete(id);
    if (!deletedBrand) {
      throw new NotFoundException('Brand not found');
    }
    return { message: 'Brand deleted successfully' };
  }

  async update(id: string, brandDTO: BrandDTO): Promise<{ message: string }> {
    const updatedBrand = await this.brandModel.findByIdAndUpdate(id, brandDTO, { new: true });

    if (!updatedBrand) {
        throw new NotFoundException('Brand not found');
    }

    return { message: 'Brand updated successfully' };
}




async index() {
  return this.brandModel.aggregate([
    {
      $lookup: {
        from: "perfumes",
        localField: "_id",
        foreignField: "brand",
        as: "perfumes",
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        image: 1,
        description: 1,
        perfumes: 1,
        hasPerfumes: { $gt: [{ $size: "$perfumes" }, 0] },
      },
    },
  ]);
}


  
  

  async show(id: string) {
    const brand = await this.brandModel.findById(id);
    if (!brand) {
      throw new NotFoundException('Brand not found');
    }
    return brand
  }
}
